const path = require('path');

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
            { test: /example\.css$/, loader: './src/index.js?modules' },
            { test: /example-camelcase\.css$/, loader: './src/index.js?modules&camelCase' },
            { test: /example-namedexport\.css$/, loader: './src/index.js?modules&namedExport' },
            {
                test: /example-camelcase-namedexport\.css$/,
                loader: './src/index.js?modules&camelCase&namedExport',
            },
            { test: /example-no-css-modules\.css$/, loader: './src/index.js' },
            { test: /example-compose\.css$/, loader: './src/index.js?modules&camelCase&namedExport' },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: ['node_modules', './src'],
    },
};
