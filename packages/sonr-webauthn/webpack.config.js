const path = require('path');

module.exports = (env) => {
  const isProd = env.production ? true : false;
  console.log(`env found to be ${isProd}`);

  return {
    entry: './src/index.ts',
    externals: {
      'react': { // import react from an external module so you don't have multiple instances
          'commonjs': 'react', 
          'amd': 'react'
      },
      'react-dom': { // some versions of react had links to react-dom so its good to include this
          'commonjs': 'react-dom',
          'amd': 'react-dom'
      }
    },
    target: 'web',
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
    output: {
      filename: 'bundle.js',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'dist'),
    }
  }
}