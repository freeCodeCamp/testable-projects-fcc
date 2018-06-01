const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, './build/testable-projects-fcc/v1'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
						plugins: [require('@babel/plugin-proposal-object-rest-spread')]
					}
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

// {
//     entry: './src/index.js',
//     output: {
//         library: 'FCC_Global',
//         path: path.join(__dirname, '/build/testable-projects-fcc/v1'),
//         filename: 'bundle.js'
//     },

// };
