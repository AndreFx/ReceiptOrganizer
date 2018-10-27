var path = require('path');

module.exports = {
    entry: {
        login: './src/main/webapp/resources/theme1/js/login/loginApp.js',
        app: './src/main/webapp/resources/theme1/js/app/index.js'
    },
    devtool: 'sourcemaps',
    cache: true,
    output: {
        path: __dirname,
        filename: './src/main/webapp/resources/theme1/js/built/[name]-bundle.js'
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react'],
                        plugins: [require('@babel/plugin-proposal-object-rest-spread'), require('@babel/plugin-proposal-class-properties')]
                    }
                }
            }
        ]
    }
};