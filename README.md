# webpack-multi-pages

> 基于 webpack v5, 创建传统多页面项目

## 功能简介

- html 文件使用了[underscore-template-loader](https://github.com/emaphp/underscore-template-loader)编译处理，支持公共 html 的引入，使得多页面的头部及尾部可以抽出统一处理，并兼容[html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) 的语法传参

- css 采用的预处理器为 Sass，并且已包含 autoprefixer 处理浏览器兼容

- js 支持使用 ES6+，已安装 babel 编译处理

- 支持雪碧图处理，包含页面公共雪碧图及页面局部雪碧图处理

- 支持打包时的图片压缩处理

- 按照`建议目录`布局就可以自动配置入口文件

## 建议目录

```
    |-- src
    |   |-- assets                        // 静态资源文件夹，会直接复制到打包资源的根目录
    |   |   |-- *.ico
    |   |   |-- media
    |   |       |-- *.mp3
    |   |       |-- *.mp4
    |   |-- components                    // 多页面的公共部分文件
    |   |   |-- footer.html
    |   |   |-- header.html
    |   |-- fonts                         // 字体类文件夹
    |   |-- images                        // 多页面公共图片资源
    |   |   |-- sprite-common.png         // 多页面公共雪碧图资源（自动生成）
    |   |   |-- sprites                   // 公共雪碧图资源文件夹（直接创建并拖进此文件夹即可）
    |   |       |-- *.png
    |   |       |-- **.png
    |   |-- pages                         // 多页面开发目录
    |   |   |-- home                      // 主页文件夹（命名固定为"home"，自动映射为index.html）
    |   |   |   |-- index.html
    |   |   |   |-- index.js
    |   |   |   |-- index.scss
    |   |   |   |-- sprite-page.scss      // 独立页面雪碧图资源（自动生成）
    |   |   |   |-- images                // 独立页面图片资源
    |   |   |       |-- sprite-home.png   // 独立页面雪碧图资源（自动生成）
    |   |   |       |-- sprites           // 独立页面雪碧图资源文件夹（直接创建并拖进此文件夹即可）
    |   |   |           |-- *.png
    |   |   |           |-- **.png
    |   |   |-- other                     // 其他页面类比主页目录结构
    |   |       |-- index.html
    |   |       |-- index.js
    |   |       |-- index.scss
    |   |-- scss                          // 多页面公共scss资源
    |       |-- common.scss
    |       |-- sprite-common.scss        // 多页面公共雪碧图scss文件（自动生成）

```

## 路径别名

```txt
通用部分：
@: src
@imgs: src/images
@cpn: src/components

独立页面部分（根据页面自动匹配，无须手动配置）
@home: src/pages/home
@other: src/pages/other
...

```

## 使用注意点

### html 部分

```html
<!-- 引入公共html文件是，前者引入需要单引号，传递的属性变量需要双引号 -->
@require('~@cpn/header.html', { "title": "主页" })

<p>主页</p>

<!-- 跳转页面使用相对路径 -->
<a href="./*.html">跳转其他页面</a>

<!-- 图片引入部分推荐“~别名”的路径引入 -->
<img src="~@home/images/**.png" alt="" />

<!-- 视频等媒体资源部分一般放在静态资源文件夹-assets -->
<!-- 引入直接使用相对路径即可 -->
<video src="./media/*.mp4"></video>

<!-- 雪碧图部分生成的类为.icon-* -->
<i class="icon-*"></i>

@require('~@cpn/footer.html')
```

### css 部分

```scss
// 背景图片引入也推荐别名路径引入
.test {
  background-image: url(@home/images/*.png);
}
```

### js 部分

```js
// 每个页面的index.js为入口文件
// 引入公共文件scss跟页面部分scss，会以外链形式引入
import '@/scss/common.scss'
import './index.scss'

// 引入第三方库
// import $ from 'jquery'

// do something
```

## 自定义配置

- 如有特殊需求，更改`webpack-conf`文件夹下的相关 webpack 配置即可
- 比如需要全局引入jq，免去在每个页面手动引入，可以安装[ProvidePlugin](https://webpack.docschina.org/plugins/provide-plugin/)进行配置
