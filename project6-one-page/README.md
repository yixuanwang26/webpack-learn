# react + dev-server单页面项目 利用模板生成 HTML

基础项目： 使用 react,并加入 dev-server 进行热启动
增加功能： 利用webpack 插件 web-webpack-plugin 打包后自动生成 html 文件

### 一、功能介绍：

主要功能为使用既有模板生成入口 html 文件：

1. 可以将 js 嵌入 html文件，不单独打包
1. 单独打包 css 样式文件后引入html文件(行内引入或 href 方式引入)
2. 设置打包后文件的文件名格式

### 二、原理解释：



### 三、所需npm包：

1. web-webpack-plugin 插件，作用是按照既有模板生成 html

```
npm i -D web-webpack-plugin
```

2. extract-text-webpack-plugin 插件，作用为将 css 文件单独打包

```
npm i -D extract-text-webpack-plugin
```

### 四、配置方法：

1. 首先安装上述两个模块

2. 修改 webpack.config.js 文件，引入这两个模块

```
const { WebPlugin } = require('web-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
```

3. 修改 entry 配置，将其配置为对象形式
```
entry: {
        app: './src/index.js'
},
```

这样配置之后，这个 chuck 的名字为 app.

4. 可以在 output 中将 bundle.js 修改成任意格式的命名,如：
```
filename: '[name]_[hash:8].js'
```

这样配置之后，打包的 js 命名为 chuck 名称+8位 hash 码。

5. module 的 rules 中增加对 css 文件的 loader 规则，可提取出 js 中 import的 css, ExtractTextPlugin将 css 打包为单独的文件。
```
{
    test: /\.css/,
    // 提取出 Chunk 中的 CSS 代码到单独的文件中
    use: ExtractTextPlugin.extract({
        use: ['css-loader'] 
    }),
},
```

6. 在 plugins 中增加 WebPlugin 的实例：

```
new WebPlugin({
    template: './src/template.html', // HTML 模版文件所在的文件路径
    filename: 'index.html', // 输出的 HTML 的文件名称
    requires: ['app']
}),
```

template 配置模板文件的位置；filename 为生成的 html 的文件名；requires 中是对当前 chuck 的名称列举，该项可不填，填写之后在模板文件任意位置插入

```
<!--SCRIPT-->
```
则可免去写

```
<script src="app"></script>
```

如果当前 app 的 chuck 已手写在 html 中，则会在 SCRIPT 的位置 插入列举的剩余 chuck 的 js 文件引入标签。

7. 在 plugins 中新增 ExtractTextPlugin 的实例，此处可设置输出的文件名格式

```
new ExtractTextPlugin({
    filename: `[name]_[contenthash:8].css`,// 给输出的 CSS 文件名称加上 Hash 值
}),
```

8. 增加 template.html 模板文件, 内容如下：

```
<html>
<head>
  <meta charset="UTF-8">
  <!--注入 Chunk app 中的 CSS-->
  <link rel="stylesheet" href="app?_inline">
</head>
<body>
<div id="app"></div>
<!--导入 Chunk app 中的 JS-->
<!--SCRIPT-->
</body>
</html>
```
_inline表示将 css 文件内容插入此处，而不是使用link引入。

除此之外，web-webpack-plugin 的类似参数还有 `_dist`, `_dev`, `_ie`

`_dist` : 只在生产环境引入

`_dev`  : 只在测试环境引入

`_ie`   : 只在 ie 浏览器中引用


### 五、注意事项：

1. extract-text-webpack-plugin 可以使用于,将不同格式的 css 单独打包，例如 scss,less

2. webpack4.x 取消了CommonsChunkPlugin插件，换为使用其他 api 接口，但是 webpack-cli 与 webpack-dev-server 用到了CommonsChunkPlugin插件，在 build 或者 start时有可能报错，建议先使用 webpack3.x，并相应降低 webpack-dev-server 的版本。



