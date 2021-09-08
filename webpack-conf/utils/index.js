const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackSpritesmith = require('webpack-spritesmith')
const path = require('path')
const glob = require('glob')

function resolve(dir) {
  return path.join(process.cwd(), dir)
}

// 获取合成雪碧图插件配置
function getSpritesConfig(options) {
  const { cwd, spriteImg, spriteCss, cssImgRef } = options

  return {
    src: {
      cwd,
      glob: '*.{png,jpg,jpeg}'
    },
    target: {
      image: spriteImg,
      css: [
        [
          spriteCss,
          {
            format: 'spritesTemplate'
          }
        ]
      ]
    },
    apiOptions: {
      cssImageRef: cssImgRef
    },
    customTemplates: {
      spritesTemplate(res) {
        return res.sprites
          .map((item) => {
            return `
            .icon-${item.name} {
              width: ${item.width}px;
              height: ${item.height}px;
              display: inline-block;
              background-image: url('${item.image}');
              background-size: ${item.total_width}px ${item.total_height}px;
              background-position: ${item.offset_x}px ${item.offset_y}px;
              background-repeat: no-repeat;
            }
          `
          })
          .join('\n')
      }
    },
    spritesmithOptions: { algorithm: 'binary-tree', padding: 10 }
  }
}

// 获取雪碧图文件夹配置
function getSpritePlugins() {
  const spritePlugins = []

  // 匹配拥有sprites文件夹的目录
  glob.sync(resolve('src/**/images/sprites')).forEach((filePath) => {
    const pathInfo = filePath.match(/\/pages\/(.+)\/images/)
    const fullPath = pathInfo ? pathInfo[0] : ''
    let folderName = pathInfo ? pathInfo[1] : ''

    let options = {
      cwd: filePath
    }

    if (folderName) {
      options = Object.assign(options, {
        spriteImg: resolve(`src${fullPath}/sprite-${folderName}.png`),
        spriteCss: resolve(`src/pages/${folderName}/sprite-page.scss`),
        cssImgRef: `~@${folderName}/images/sprite-${folderName}.png`
      })
    } else {
      options = Object.assign(options, {
        spriteImg: resolve(`src/images/sprite-common.png`),
        spriteCss: resolve(`src/scss/sprite-common.scss`),
        cssImgRef: `~@/images/sprite-common.png`
      })
    }
    spritePlugins.push(new WebpackSpritesmith(getSpritesConfig(options)))
  })
  return spritePlugins
}

// 获取多入口页面配置
function getPagesConfig() {
  const entry = {}
  const alias = {}
  const htmlWebpackPlugins = []

  glob.sync(resolve('src/pages/*/index.js')).forEach((filePath) => {
    const filename = filePath.match(/\/pages\/(.+)\/index.js/)[1]
    entry[filename] = filePath
    // 配置页面的别名，方便资源引入
    alias[`@${filename}`] = resolve(`src/pages/${filename}`)

    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: resolve(`src/pages/${filename}/index.html`),
        filename: `${filename === 'home' ? 'index' : filename}.html`,
        chunks: [filename]
      })
    )
  })

  return {
    entry,
    alias,
    htmlWebpackPlugins
  }
}

module.exports = {
  resolve,
  getPagesConfig,
  getSpritePlugins
}
