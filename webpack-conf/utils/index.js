const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const glob = require('glob')

function resolve(dir) {
  return path.join(process.cwd(), dir)
}

// 获取多入口页面配置
function getPagesConfig() {

  const entry = {}
  const alias = {}
  const htmlWebpackPlugins = []

  glob.sync(resolve('src/pages/*/index.js')).forEach(filePath => {
    const filename = filePath.match(/\/pages\/(.+)\/index.js/)[1]
    entry[filename] = filePath
    // 配置页面的别名，方便资源引入
    alias[`@${filename}`] = resolve(`src/pages/${filename}`)

    htmlWebpackPlugins.push(new HtmlWebpackPlugin({
      template: resolve(`src/pages/${filename}/index.html`),
      filename: `${filename === 'home' ? 'index' : filename}.html`,
      chunks: [filename]
    }))

  })

  return {
    entry,
    alias,
    htmlWebpackPlugins
  }

}

module.exports = {
  resolve,
  getPagesConfig
}