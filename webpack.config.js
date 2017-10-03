const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        library: 'FCC_Global',
        path: path.join(__dirname, '/build'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['env']
                }
            },
            {
              test: /\.css$/,
              exclude: /node_modules/,
              // chained loaders: 
              // style-loader injects css imported by css-loader
              loader: 'style-loader!css-loader'
            },
            {
              test: /\.html$/,
              exclude: /node_modules/,
              // creates String for importing into JS
              loader: 'html-loader'
            }
        ]
    }
};
