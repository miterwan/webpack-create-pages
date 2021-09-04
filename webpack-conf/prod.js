const { merge } = require('webpack-merge')
const { resolve } = require('./utils')
const common = require('./common')

const config = {
  mode: 'production',
  output: {
    filename: 'js/[name].[contenthash:8].js',
    // 打包后的存放目录
    path: resolve('dist'),
    // 静态资源资源的相对路径
    publicPath: './',
    // 清除旧打包文件，开发环境不要设置，否则修改js/css时会导致图片等资源丢失
    clean: true
  }
}

module.exports = merge(common, config)