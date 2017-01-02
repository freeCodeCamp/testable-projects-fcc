
module.exports = {
    entry: "./src/index.js",
    output: {
        library: 'FCC_Global',
        path: __dirname + '/build',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            } 
        ]
    }
};