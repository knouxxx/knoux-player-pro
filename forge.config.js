const webpack = require('webpack');

module.exports = {
  packagerConfig: {
    asar: true,
    out: 'out',
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {},
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['win32', 'darwin'],
    },
  ],
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        port: 9000,
        mainConfig: {
          entry: './desktop/main/main.ts',
          module: {
            rules: require('./webpack.rules'),
          },
          resolve: {
            extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
          },
          plugins: [
            new webpack.DefinePlugin({
              __dirname: JSON.stringify(''),
              global: 'globalThis',
              'process.env': JSON.stringify(process.env),
            }),
          ],
        },
        renderer: {
          config: {
            module: {
              rules: require('./webpack.rules'),
            },
            resolve: {
              extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
            },
            plugins: [
              new webpack.DefinePlugin({
                __dirname: JSON.stringify(''),
                global: 'window',
                'process.env': JSON.stringify(process.env),
              }),
            ],
          },
          devServer: {
            port: 9000,
          },
          entryPoints: [
            {
              html: './desktop/renderer/index.html',
              js: './desktop/renderer/index.tsx',
              name: 'main_window',
              preload: {
                js: './desktop/preload/preload.ts',
              },
            },
          ],
        },
      },
    ],
  ],
};
