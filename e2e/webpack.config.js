const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const basePath = process.cwd();
  const isDev = argv.mode === 'development';
  return {
    entry: path.resolve(basePath, 'src', 'index.tsx'),
    output: {
      filename: './index.js',
    },
    mode: isDev ? 'development' : 'production',
    devtool: 'source-map',
    optimization: {
      minimize: !isDev,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            format: {
              comments: false,
            },
          },
          extractComments: false,
        }),
      ],
    },
    plugins: [
      new HtmlWebpackPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
  };
};
