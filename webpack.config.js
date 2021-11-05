const path = require('path');
const webpack = require('webpack');

module.exports = function (env = {}) {
  const __DEV__ = env.production ? false : true;
  const outputPath = path.join(__dirname, 'build/testable-projects-fcc/v1');
  return {
    mode: __DEV__ ? 'development' : 'production',
    entry: './src/index.js',
    output: {
      library: 'FCC_Global',
      path: outputPath,
      filename: 'bundle.js'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          // uses config from .babelrc
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          // creates String for importing into JS
          loader: 'css-loader'
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          // creates String for importing into JS
          loader: 'html-loader'
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer']
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser'
      })
    ],
    resolve: {
      fallback: {
        path: require.resolve('path-browserify'),
        util: require.resolve('util/')
      }
    }
  };
};
