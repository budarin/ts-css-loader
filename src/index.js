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
        usable: false,
        server: false,
        camelCase: true,
        onlyNamedExport: false,
        ...query,
    };

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
        const EOL = EOLs[options.EOL || 'CRLF'];
        const cssModuleInterfaceFilename = filenameToTypingsFilename(filename);

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

            cssModuleDefinition = generateNamedExports(options, nonReservedWordDefinitions, EOL);
        } else {
            cssModuleDefinition = generateGenericExportInterface(options, cssModuleKeys, filename, EOL);
        }

        if (cssModuleDefinition.trim() === '') {
            // Ensure empty CSS modules export something
            cssModuleDefinition = `export {};${EOL}`;
        }

        if (options.banner) {
            // Prefix banner to CSS module
            cssModuleDefinition = options.banner + EOL + cssModuleDefinition;
        }

        persist.writeToFileIfChanged(cssModuleInterfaceFilename, cssModuleDefinition, EOL);

        // mock async step 3 - make `async` return the actual callback again before calling the 'real' css-loader
        delegateToCssLoader(this, input, callback);
    };
    cssLocalsLoader.call(this, ...input);
};
