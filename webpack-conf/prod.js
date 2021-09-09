const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ImageminWebpackPlugin = require('imagemin-webpack-plugin').default

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
    }),
    // 打包时对图片资源进行压缩
    new ImageminWebpackPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      pngquant: [0.8, 1],
      gifsicle: {
        optimizationLevel: 3
      }
    })
  ]
}

module.exports = merge(base, config)
