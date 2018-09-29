import path from 'path';

const filenameToInterfaceName = filename => {
    return path
        .basename(filename)
        .replace(/^(\w)/, (_, c) => 'I' + c.toUpperCase())
        .replace(/\W+(\w)/g, (_, c) => c.toUpperCase());
};

const cssModuleToNamedExports = (options, cssModuleKeys) => {
    const result = cssModuleKeys.map(key => `export const ${key}: string;`);

    if (options.browser) {
        result.push('export const use: Function;');
        result.push('export const unuse: Function;');
    }

    if (options.server) {
        result.push('export const source: string;');
    }

    result.push('');

    return result;
};

const allWordsRegexp = /^\w+$/i;
export const filterNonWordClasses = cssModuleKeys => {
    const filteredClassNames = cssModuleKeys.filter(classname => allWordsRegexp.test(classname));
    if (filteredClassNames.length === cssModuleKeys.length) {
        return [filteredClassNames, []];
    }
    const nonWordClassNames = cssModuleKeys.filter(classname => !allWordsRegexp.test(classname));
    return [filteredClassNames, nonWordClassNames];
};

// Documented here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#Reserved_keywords_as_of_ECMAScript_2015
const reservedWords = [
    'break',
    'case',
    'catch',
    'class',
    'const',
    'continue',
    'debugger',
    'default',
    'delete',
    'do',
    'else',
    'export',
    'extends',
    'finally',
    'for',
    'function',
    'if',
    'import',
    'in',
    'instanceof',
    'new',
    'return',
    'super',
    'switch',
    'this',
    'throw',
    'try',
    'typeof',
    'var',
    'void',
    'while',
    'with',
    'yield',
];

export const filterReservedWordClasses = cssModuleKeys => {
    const filteredClassNames = cssModuleKeys.filter(classname => reservedWords.indexOf(classname) === -1);
    if (filteredClassNames.length === cssModuleKeys.length) {
        return [filteredClassNames, []];
    }
    const reservedWordClassNames = cssModuleKeys.filter(classname => reservedWords.indexOf(classname) !== -1);
    return [filteredClassNames, reservedWordClassNames];
};

export const filenameToTypingsFilename = filename => {
    const dirName = path.dirname(filename);
    const baseName = path.basename(filename);

    return path.join(dirName, `${baseName}.d.ts`);
};

const cssModuleToTypescriptInterfaceProperties = (cssModuleKeys, indent = '  ') => {
    const result = cssModuleKeys.map(
        key => (key.includes('-') ? `${indent}readonly '${key}': string;` : `${indent}readonly ${key}: string;`),
    );

    return result;
};

// Generate utils
export const generateNamedExports = (options, cssModuleKeys, EOL) => {
    const namedExports = cssModuleToNamedExports(options, cssModuleKeys);

    return namedExports.join(EOL);
};

export const generateGenericExportInterface = (options, cssModuleKeys, filename, EOL, indent = '  ') => {
    const localsInterface = 'export interface IStyles {';
    const interfaceName = filenameToInterfaceName(filename);
    const interfaceProperties = cssModuleToTypescriptInterfaceProperties(cssModuleKeys, indent);
    const usableInterfaceProperties = [`${indent}readonly use: Function;`, `${indent}readonly unuse: Function;`];
    const result = [];

    result.push(
        localsInterface,
        ...interfaceProperties,
        '}',
        '',
        `export interface ${interfaceName} {`,
        `${indent}readonly locals: IStyles;`,
    );

    if (options.browser) {
        result.push(...usableInterfaceProperties);
    }

    if (options.server) {
        result.push(`${indent}readonly source: string;`);
        result.push(...interfaceProperties);
    }

    result.push('}', '', `declare const styles: ${interfaceName};`, '', 'export default styles;', '');

    return result.join(EOL);
};
