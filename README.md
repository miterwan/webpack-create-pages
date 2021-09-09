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

## 自定义配置

- 如有特殊需求，更改`webpack-conf`文件夹下的相关 webpack 配置即可
