import fs from 'fs';
import path from 'path';
import cssLoader from 'css-loader';
import cssLocalsLoader from 'css-loader/locals';
import loaderUtils from 'loader-utils';
import 'colour';
import os from 'os';

import {
    filterNonWordClasses,
    filterReservedWordClasses,
    generateNamedExports,
    generateGenericExportInterface,
    filenameToTypingsFilename,
} from './cssModuleToInterface';
import * as persist from './persist';
import loggerCreator from './logger';

const filePath = path.resolve('./.prettierrc');
let prettierrc = {};
if (fs.existsSync(filePath)) {
    const jsonString = fs.readFileSync(filePath, 'utf-8');
    try {
        prettierrc = JSON.parse(jsonString);
    } catch (err) {}
}

function delegateToCssLoader(ctx, input, callback) {
    ctx.async = () => callback;
    cssLoader.call(ctx, ...input);
}

module.exports = function(...input) {
    if (this.cacheable) this.cacheable();

    // mock async step 1 - css loader is async, we need to intercept this so we get async ourselves
    const callback = this.async();
    const query = loaderUtils.getOptions(this);
    const logger = loggerCreator(query.silent);
    const moduleMode = query.modules || query.module;
    const tabWidths = [2, 4];
    const tabWidth = prettierrc.tabWidth || 4;
    const EOLs = {
        CRLF: os.EOL,
        LF: '\n',
    };

    if (!moduleMode) {
        logger('warn', 'Typings for CSS-Modules: option `modules` is not active - skipping extraction work...'.red);
        return delegateToCssLoader(this, input, callback);
    }

    const options = {
        EOL: 'CRLF',
        tabWidth,
        browser: false,
        server: false,
        camelCase: true,
        onlyNamedExport: false,
        ...query,
    };

    options.tabWidth = tabWidths.includes(options.tabWidth) ? options.tabWidth : tabWidth;

    // mock async step 2 - offer css loader a "fake" callback
    this.async = () => (err, content) => {
        if (err) {
            return callback(err);
        }

        let match;
        let cssModuleDefinition;

        const cssModuleKeys = [];
        const keyRegex = /"([^\\"]+)":/g;
        const filename = this.resourcePath;
        const EOL = EOLs[options.EOL] || EOLs['CRLF'];
        const tabsString = ''.padStart(options.tabWidth);
        const cssModuleInterfaceFilename = filenameToTypingsFilename(filename);
        const params = {
            EOL,
            tabsString,
        };

        while ((match = keyRegex.exec(content))) {
            if (cssModuleKeys.indexOf(match[1]) < 0) {
                cssModuleKeys.push(match[1]);
            }
        }

        if (options.onlyNamedExport) {
            const [cleanedDefinitions, skippedDefinitions] = filterNonWordClasses(cssModuleKeys);
            const [nonReservedWordDefinitions, reservedWordDefinitions] = filterReservedWordClasses(cleanedDefinitions);

            if (skippedDefinitions.length > 0 && !options.camelCase) {
                logger(
                    'warn',
                    `Typings for CSS-Modules: option 'onlyNamedExport' was set but 'camelCase' for the css-loader not.
The following classes will not be available as named exports:
${skippedDefinitions.map(sd => ` - "${sd}"`).join('\n').red}
`.yellow,
                );
            }

            if (reservedWordDefinitions.length > 0) {
                logger(
                    'warn',
                    `Your css contains classes which are reserved words in JavaScript.
Consequently the following classes will not be available as named exports:
${reservedWordDefinitions.map(rwd => ` - "${rwd}"`).join('\n').red}
These can be accessed using the object literal syntax; eg styles['delete'] instead of styles.delete.
`.yellow,
                );
            }

            cssModuleDefinition = generateNamedExports(options, nonReservedWordDefinitions, params);
        } else {
            cssModuleDefinition = generateGenericExportInterface(options, cssModuleKeys, filename, params);
        }

        if (cssModuleDefinition.trim() === '') {
            // Ensure empty CSS modules export something
            cssModuleDefinition = `export {};${EOL}`;
        }

        if (options.banner) {
            // Prefix banner to CSS module
            cssModuleDefinition = options.banner + EOL + cssModuleDefinition;
        }

        persist.writeToFileIfChanged(cssModuleInterfaceFilename, cssModuleDefinition, params);

        // mock async step 3 - make `async` return the actual callback again before calling the 'real' css-loader
        delegateToCssLoader(this, input, callback);
    };
    cssLocalsLoader.call(this, ...input);
};
