import * as path from 'path';
import * as webpack from 'webpack';
// just in case you run into any typescript error when configuring `devServer`
import 'webpack-dev-server';

const config: webpack.Configuration = {
  mode: 'production',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.bundle.js',
  },
  module: {
    rules: [

    ]
  },

  devServer: {
    contentBase: './dist',
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  }
};

export default config;