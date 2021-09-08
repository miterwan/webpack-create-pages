const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const { resolve, getPagesConfig, getSpritePlugins } = require('./utils')

const pageConfig = getPagesConfig()

module.exports = {
  entry: pageConfig.entry,
  resolve: {
    // 配置路径别名
    alias: {
      '@': resolve('src'),
      '@imgs': resolve('src/images'),
      '@cpn': resolve('src/components'),
      ...pageConfig.alias
    }
  },
  module: {
    rules: [
      // 用于公共部分html的处理
      {
        test: /\.html$/,
        use: [
          {
            loader: 'underscore-template-loader',
            options: {
              // 处理图片，视频，音频引入
              attributes: [
                'img:src'
                // 如若需要可配置，一般放置在静态资源文件夹直接copy到打包目录
                // 'video:src',
                // 'audio:src'
              ]
            }
          }
        ]
      },
      // scss文件处理
      {
        test: /\.(c|s[ac])ss$/i,
        use: [
          // 不使用热更新开发，直接以外联样式加载
          MiniCssExtractPlugin.loader,
          // 将CSS转化成CommonJS模块
          {
            loader: 'css-loader',
            options: {
              // 配置应用规则之前的loader使用数量
              importLoaders: 2
            }
          },
          // 浏览器前缀处理
          'postcss-loader',
          // 将Sass编译成CSS
          'sass-loader'
        ]
      },
      // js的babel处理
      {
        test: /\.m?js$/,
        // 不处理npm包
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // 使用缓存
              cacheDirectory: true
            }
          }
        ]
      },
      // 由于webpack5.0内置资源处理对underscore-template-loader不兼容，故图片等资源还是采取外置loader处理
      // 图片资源处理
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/i,
        // webpack5.0+自带内置资源处理，会影响到scss的背景图片使用，故设置此值
        type: 'javascript/auto',
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              // 打包统一输出到images文件夹
              outputPath: 'images',
              // 防止图片资源引用读取错误
              esModule: false,
              // 小于8kb转为base64
              limit: 0.01 * 1024
            }
          }
        ]
      },
      // 字体资源类处理
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'javascript/auto',
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              outputPath: 'fonts',
              esModule: false,
              limit: 8 * 1024
            }
          }
        ]
      },
      // 音频/视频资源类处理
      {
        test: /\.(mp4|mov|webm|ogg|mp3|wav|flac|aac)$/i,
        type: 'javascript/auto',
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[hash:8].[ext]',
              outputPath: 'media',
              esModule: false,
              limit: 8 * 1024
            }
          }
        ]
      }
    ]
  },
  plugins: [
    ...pageConfig.htmlWebpackPlugins,
    // 静态资源文件夹，不需要经过webpack处理的直接复制到打包目录
    new CopyWebpackPlugin({
      patterns: [
        // 直接放在根目录下，与.html文件同级
        { from: resolve('src/assets'), to: '' }
      ]
    }),
    // 雪碧图处理
    ...getSpritePlugins()
  ],
  optimization: {
    // 代码优化分割
    splitChunks: {
      // 对所有导入的模块进行处理
      chunks: 'all',
      // 生成公共模块的最小体积，设为0，只要是用到的公共模块就生成公共模块
      minSize: 0,
      cacheGroups: {
        default: {
          // 公共业务代码命名为common
          name: 'common',
          // 最少被引用2次
          minChunks: 2,
          // 多个缓存组配置的时候复用chunk设置
          reuseExistingChunk: true,
          priority: -20
        },
        // 第三方库引用配置
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          minChunks: 1,
          reuseExistingChunk: true,
          priority: -10
        }
      }
    }
  },
  performance: {
    // 只检测js文件的大小超过1MB的时候进行警告提示
    assetFilter: function (assetFilename) {
      return assetFilename.endsWith('.js')
    },
    // 超过1MB警告提示
    maxAssetSize: 1024 * 1024
  }
}
