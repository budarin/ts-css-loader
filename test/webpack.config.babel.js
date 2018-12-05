module.exports = {
    mode: 'development',
    entry: './test/entry.ts',
    output: {
        path: __dirname,
        filename: 'bundle.js',
    },
    module: {
        rules: [
            { test: /\.ts$/, loader: ['ts-loader'] },

            {
                test: /example\.css$/,
                loader: './src/index.js',
                options: { EOL: 'LF', modules: true },
            },
            {
                test: /example-empty\.css$/,
                loader: './src/index.js',
                options: { EOL: 'LF', modules: true },
            },
            {
                test: /example-camelcase\.css$/,
                loader: './src/index.js',
                options: { EOL: 'LF', modules: true, camelCase: true, browser: true, server: true },
            },
            {
                test: /example-namedexport\.css$/,
                loader: './src/index.js',
                options: { EOL: 'LF', modules: true, onlyNamedExport: true, browser: true, server: true },
            },
            {
                test: /example-camelcase-namedexport\.css$/,
                loader: './src/index.js',
                options: { EOL: 'LF', modules: true, camelCase: true, onlyNamedExport: true },
            },
            {
                test: /example-no-css-modules\.css$/,
                loader: './src/index.js',
                options: { EOL: 'LF', modules: false, silent: false },
            },
            {
                test: /example-compose\.css$/,
                loader: './src/index.js',
                options: { EOL: 'LF', modules: true, camelCase: true, onlyNamedExport: true },
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: ['node_modules', './src'],
    },
};
