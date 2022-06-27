const path = require('path');
const webpack = require('webpack');

module.exports = (env) => {
  const isProd = env.production ? true : false;
  console.log(`env found to be ${isProd}`);

  return {
    entry: './src/index.ts',
    target: 'es6',
    mode: isProd ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
    output: {
      chunkFilename: '[name].js',
      chunkFormat: 'module',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'dist')
    }
  }
}