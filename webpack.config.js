const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  mode: 'development',
  // mode: 'production',
  entry: {
    home: './src/pages/home/index.js',
    contact: './src/pages/contact/index.js'
  },
  output: {
    filename: 'js/[name].[hash:8].js',
    // 配置打包后的资源存放目录
    path: resolve('dist'),
    // 配置打包后静态资源资源相对于线上服务器的路径地址
    publicPath: '/',
    // 开发时不要设置清除，否则修改js/css时会导致图片等资源丢失
    // clean: true
  },
  resolve: {
    // 配置路径别名
    alias: {
      '@': resolve('src'),
      '@imgs': resolve('src/images'),
      '@cpn': resolve('src/components'),
      '@pages': resolve('src/pages'),
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
              // 处理图片引入，视频引入
              attributes: ['img:src', 'video:src', 'audio:src']
            }
          }
        ]
      },
      // scss文件处理
      {
        test: /\.s[ac]ss$/i,
        use: [
          // MiniCssExtractPlugin.loader,
          // 将js字符串生成为style节点
          'style-loader',
          // 将CSS转化成CommonJS模块
          'css-loader',
          // 将Sass编译成CSS
          'sass-loader'
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
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: '主页',
      template: resolve('src/pages/home/index.html'),
      filename: 'index.html',
      chunks: ['home']
    }),
    new HtmlWebpackPlugin({
      title: '联系',
      template: resolve('src/pages/contact/index.html'),
      filename: 'contact.html',
      chunks: ['contact']
    }),
    // 静态资源，不需要经过webpack处理的直接复制到打包目录
    new CopyWebpackPlugin({
      patterns: [
        { from: resolve('src/assets'), to: 'static' }
      ]
    })
    // new MiniCssExtractPlugin()
  ],
  optimization: {
    splitChunks: {
      minSize: 0
    }
  },
  devtool: 'source-map',
  devServer: {
    hot: false
  }
}