const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (options, { mode }) => ({
  entry: './src/index.ts',
  output: {
    filename: '[name].js',
    chunkFilename: '[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        loader: 'ts-loader',
      },
      {
        test: /.scss|.css$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
      }
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          enforce: true,
          chunks: 'all',
        },
        default: {
          minSize: 0,
          reuseExistingChunk: true,
        },
      },
    },
  },
  mode,
  ...(mode === 'development' && {
    devServer: {
      port: 3000,
      historyApiFallback: true,
    },
    devtool: 'source-map',
  }),
  plugins: [
    new HTMLWebpackPlugin({
      template: './src/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './src/assets',
          to: 'assets',
        }
      ],
    }),
  ],
})
