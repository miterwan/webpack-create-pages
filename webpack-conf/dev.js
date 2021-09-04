const { merge } = require('webpack-merge')
const common = require('./common')

const config = {
  mode: 'development',
  output: {
    filename: 'js/[name].js'
  },
  // devtool: 'source-map',
  devServer: {
    // 不开启热更新，只使用live reload
    hot: false
  }
}

module.exports = merge(common, config)