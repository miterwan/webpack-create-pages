const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { merge } = require('webpack-merge')
const base = require('./base')

const config = {
  mode: 'development',
  output: {
    filename: 'js/[name].js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    })
  ],
  // devtool: 'source-map',
  devServer: {
    // 不开启热更新，只使用live reload
    hot: false
  }
}

module.exports = merge(base, config)