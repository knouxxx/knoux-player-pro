const path = require('path');

module.exports = {
  mode: 'production',
  entry: './desktop/main/main.ts',
  target: 'electron-main',
  output: {
    path: path.resolve(__dirname, '../dist/main'),
    filename: 'main.js',
  },
  resolve: {
    extensions: ['.js', '.ts', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};
