const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  entry: path.resolve(__dirname, '../src/index.ts'),
  target: 'node',
  node: {
    __dirname: false
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        enforce: 'pre',
        use: [
          { loader: 'tslint-loader' }
        ]
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js', '.json' ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {
      root: path.resolve(__dirname , '..'),
      verbose: true
    })
  ],
  output: {
    filename: 'mfcdm.js',
    path: path.resolve(__dirname, '../dist'),
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true
  }
}