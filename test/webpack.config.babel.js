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
                options: { modules: true },
            },
            {
                test: /example-camelcase\.css$/,
                loader: './src/index.js',
                options: { modules: true, camelCase: true },
            },
            {
                test: /example-namedexport\.css$/,
                loader: './src/index.js',
                options: { modules: true, namedExport: true },
            },
            {
                test: /example-camelcase-namedexport\.css$/,
                loader: './src/index.js',
                options: { modules: true, camelCase: true, namedExport: true },
            },
            {
                test: /example-no-css-modules\.css$/,
                loader: './src/index.js',
                options: { silent: true }, //set silent: false to have an error during loding time
            },
            {
                test: /example-compose\.css$/,
                loader: './src/index.js',
                options: { modules: true, camelCase: true, namedExport: true },
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        modules: ['node_modules', './src'],
    },
};
