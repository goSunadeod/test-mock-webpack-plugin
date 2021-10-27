const path = require('path');
const HappyMockMockPlugin = require('../../lib/index');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    noInfo: true,
    quiet: true,
    before: () => {
      // console.log('outer before');
    },
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new HappyMockMockPlugin({
      root: path.resolve(__dirname, 'mock'),
      lazy: true,
      autoRefresh: true,
    }),
  ],
};
