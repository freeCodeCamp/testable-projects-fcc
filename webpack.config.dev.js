const path = require('path');

const PROJECT_PATH = path.join(__dirname, '/local_test');

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		library: 'FCC_Global',
		path: path.join(PROJECT_PATH, '/js'),
		filename: 'bundle.js'
	},
	devServer: {
		https: true
	},
	module: {
		rules: [
		{
			test: /\.js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env']
				}
			}
		},
		{
			test: /\.css$/,
			exclude: /node_modules/,
			// chained loaders:
			// style-loader injects css imported by css-loader
			loader: 'css-loader'
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
