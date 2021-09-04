const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { merge } = require('webpack-merge')
const { resolve } = require('./utils')
const base = require('./base')

const config = {
  mode: 'production',
  output: {
    filename: 'js/[name].[contenthash:8].js',
    // 打包后的存放目录
    path: resolve('dist'),
    // 静态资源资源的相对路径
    publicPath: 'auto',
    // 清除旧打包文件，开发环境不要设置，否则修改js/css时会导致图片等资源丢失
    clean: true
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css'
    })
  ]
}

module.exports = merge(base, config)