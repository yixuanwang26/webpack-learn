# react + dev-server多页面管理项目

基础项目： 使用 react,并加入 dev-server 进行热启动
增加功能： 利用插件 web-webpack-plugin 打包 login 与 index 两个页面，将两页面各自的 js 与 css 分开打包插入对应 html 文件，将两页面公用部分的 js,css 打包为 common 文件进行引入。

### 一、功能介绍：

主要功能为使用既有模板生成不同的入口 html 文件，在上一节的内容上增加：

1. 为两个入口 index 与 login 生成相应的 html 文件，并且将其依赖的不同 js 文件进行分开打包，相同 js 打包为公共的 js 文件，将入口自己的 js与公共 js 引入 html 文件。
2. 设定共同的 css 样式文件，无需引入，在 webpack 配置文件中配置即可，将其打包为单独文件，分别引入；单独引入的 css 文件各自打包，分别引入。

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

1. 在前一节的基础上修改 template.html 

```
<head>
  <meta charset="UTF-8">
  <!--在这注入该页面所依赖但没有手动导入的 CSS-->
  <!--STYLE-->
</head>
```

在模板文件头部增加`STYLE`标签，使不同 chunk 的 css 文件可以自动引入。

2. 修改 webpack 配置文件，替换引入模块
```
const { AutoWebPlugin } = require('web-webpack-plugin');
```

3. 修改 webpack 配置文件，先生成 AutoWebPlugin 的实例，注意配置项

```
// 使用本文的主角 AutoWebPlugin，自动寻找 pages 目录下的所有目录，把每一个目录看成一个单页应用
const autoWebPlugin = new AutoWebPlugin('page', {
    template: './template.html', // HTML 模版文件所在的文件路径
    postEntrys: ['./common.css'],// 所有页面都依赖这份通用的 CSS 样式文件
    // 提取出所有页面公共的代码
    commonsChunk: {
        name: 'common',// 提取出公共代码 Chunk 的名称
    },
});
```

4. 将 entry 配置项修改为由autoWebPlugin产生，在 entry 方法中可以增加额外的入口 chunk

```
entry: autoWebPlugin.entry({
        // 这里可以加入你额外需要的 Chunk 入口
}),
```

5. 在插件配置中增加该实例

```
plugins: [
        autoWebPlugin,
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({
            filename: `[name]_[contenthash:8].css`,// 给输出的 CSS 文件名称加上 Hash 值
        }),
],
```




### 五、注意事项：

1. AutoWebPlugin 在生成入口文件配置时，会检索其实例构造参数第一个值对应文件路径下的文件夹，比如该项目配置的为 page,则会检索 page 文件路径下的文件夹，有几个文件夹即会生成几个 chunk, chunk 名为对应文件夹名，而文件夹下的文件统一命名为 index.js 与 index.css.

2. common.css 在 webpack 配置文件中经过配置后并不需要再单独引入每个 js 中。

3. 以上配置后 build 即可，如果需要热启动，则需要配置devServer 中的historyApiFallback，使其对应不同路径返回不同页面。

```
historyApiFallback: {
    rewrites: [
        // 对 login,index 开头的路径分别返回不同页面
        { from: /^\/login/, to: '/login.html' },
        { from: /^\/index/, to: '/index.html' },
        // 其它的都返回 index.html
        { from: /./, to: '/index.html' },
    ]
},
```


