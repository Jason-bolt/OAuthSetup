const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const NodemonPlugin = require('nodemon-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './index.ts', // Your entry point file
  devtool: 'source-map',
  mode: process.env.NODE_ENV || 'development',
  target: 'node', // Specify we're targeting Node.js environment
  externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // Exclude Node.js modules from the bundle
  module: {
    rules: [
      {
        test: /\.ts$/, // Apply this rule to TypeScript files
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  devServer: {
    open: true,
    host: 'localhost',
    port: process.env.PORT || 3003
},
  resolve: {
    extensions: ['.ts', '.js', '...'], // Resolve these extensions
  },
  plugins: [
    new NodePolyfillPlugin(),
    new NodemonPlugin(),
    new Dotenv(),
    new webpack.EnvironmentPlugin({ ...process.env })
],
  output: {
    filename: 'bundle.js', // Output bundle file name
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
};
