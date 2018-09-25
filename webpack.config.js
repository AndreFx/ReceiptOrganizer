var path = require('path');

module.exports = {
    entry: {
        login: './src/main/webapp/resources/theme1/js/login/loginApp.js',
        app: './src/main/webapp/resources/theme1/js/app/organizerApp.js'
    },
    devtool: 'sourcemaps',
    cache: true,
    debug: true,
    output: {
        path: __dirname,
        filename: './src/main/webapp/resources/theme1/js/built/[name]-bundle.js'
    },
    module: {
        loaders: [
            {
                test: path.join(__dirname, '.'),
                exclude: /(node_modules)/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
};