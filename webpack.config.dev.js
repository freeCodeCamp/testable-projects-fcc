const PROJECT_PATH = __dirname + '/local_test'
module.exports = {
    entry: "./src/index.js",
    output: {
        library: 'FCC_Global',
        path: PROJECT_PATH + '/js',
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