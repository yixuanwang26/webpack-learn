# react项目优化

## 缩小文件搜索范围

### 优化效果：
 
webpack在打包时，从入口文件开始一步一步查找当前文件通过 import 或者 require 引入的其他依赖文件，找到之后使用配置的 loader 去转化语法。

在文件很多，项目架构庞大时，以上步骤的花费时间将会占据大部分打包时间，因此在 webpack 第一步搜索查找 import 文件时，如果能缩小文件搜索范围，将会有效压缩打包时间，提高效率。

### 实现方法：

1. 在 loader 加载时，过滤不必要的文件，或者指定对应文件夹：
```
{
    test: /\.js$/,
    use: ["babel-loader?cacheDirectory"],
    include: path.resolve(__dirname, 'src'),
}
```
其中，
```
include: path.resolve(__dirname, 'src'),
```
缩小了可转换的 js 文件的查询范围，限制在 src 文件夹下。

`cacheDirectory` 为 babel-loader 的一个选项，使其支持缓存转换出的结果。

2. 配置 resolve 下的
```
modules: [path.resolve(__dirname, 'node_modules')]
```

可设置当前项目的所有模块都从项目下的 node_modules 文件夹下查询。即没有使用全局模块的项目可配置该选项。

3. 配置 resolve 下的

```
extensions: ['.js'],
```
该项配置了当出现 ` import xx from '../Card' ` 这样的引入时，自动查找什么类型的文件，以上配置为 .js 文件，建议尽量减少这种引入方式，配置该项时也尽可能少配置种类。

4. 配置 resolve 下的
```
alias: {
            'react-dom': path.resolve(__dirname, './node_modules/react-dom/dist/react-dom.min.js'),
            'react': path.resolve(__dirname, './node_modules/react/dist/react.min.js'),
        },
```
该项是配置 import 时的某些路径或者模块，为其取别名并配置路径，方便引入。

例如：
```
import Utility from '../../utilities/utility';
```

在配置过
```
alias: {
  Utilities: path.resolve(__dirname, 'src/utilities/')
}
```
之后，可以这样引入：
```
import Utility from 'Utilities/utility';
```

在本项目中，利用这种配置方法将‘react’ 配置为其模块包中的
```
/node_modules/react/dist/react.min.js
```

`react.min.js` 为 react 的打包后的最小压缩包，其中没有 import，require 等导入语法，因此可以同时配置 module 下的 noParse 选项：

```
module: {
    // 独完整的 `react.min.js` 文件就没有采用模块化，忽略对 `react.min.js` 文件的递归解析处理
    noParse: [/react\.min\.js$/],
  },
```

一般来说，如果引入某模块的最小压缩包时，配套 noParse 配置使用。

 
### 适用情况：

第五项优化适用于整体性较强的模块，对于 lodash 这种模块，引用的方法如果不多，使用这种方式打包反而会增加不必要的代码。

### 注意事项:

在对 react 配置别名时，报错，内容为无法找到 react-dom 中引入的 react 模块，因此解决办法为将 react-dom 同时以最小压缩包形式引入。它自成整体，就不需要再依赖 react 了。

## 使用 DllPlugin

### 优化效果：
 
利用 DllPlugin 插件生成 dll 文件，这些文件中可以打包常用的模块内容，使得依赖这些内容的代码在引入时，可以动态地从 dll 文件加载内容。而这些 dll 文件只编译一次，如果模块的版本不进行升级，则该 dll 文件无需再次编译。

这样节省了每次打包时打包同一未变化模块的时间，并且保证多次引入的模块内容只被编译一次。

### 实现方法：

1. dll 文件的生成要配置单独的 webpack 文件，在项目中创建 webpack.dll.config.js 文件。

```
const path = require('path');
const DllPlugin = require('webpack/lib/DllPlugin');

module.exports = {
    entry: {
      // 把 React 相关模块的放到一个单独的动态链接库
      react: ['react', 'react-dom'],
      // 把项目需要所有的 polyfill 放到一个单独的动态链接库
      polyfill: ['core-js/fn/object/assign', 'core-js/fn/promise', 'whatwg-fetch'],
    },
    output: {
      filename: '[name].dll.js',
      path: path.resolve(__dirname, 'dist'),
      // 存放动态链接库的全局变量名称，例如对应 react 来说就是 _dll_react
      // 之所以在前面加上 _dll_ 是为了防止全局变量冲突
      library: '_dll_[name]',
    },
    plugins: [
      // 接入 DllPlugin
      new DllPlugin({
        // 动态链接库的全局变量名称，需要和 output.library 中保持一致
        // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
        // 例如 react.manifest.json 中就有 "name": "_dll_react"
        name: '_dll_[name]',
        // 描述动态链接库的 manifest.json 文件输出时的文件名称
        path: path.join(__dirname, 'dist', '[name].manifest.json'),
      }),
    ],
  };
```

入口文件为想要打包为 dll 文件的模块，此项目提供两个入口文件，一个是 react 模块， 一个是一些 polyfill 模块。output 中的 library 表示存放链接库的全局变量名称，其他文件按照该变量名进行引入。

在插件中配置 DllPlugin 实例。name 属性对应上面的 library,path 配置.json 文件路径和名称。

.json 文件用于描述该打包的 dll 文件中包含了哪些模块。方便按照模块名查找 dll 中的模块内容。

2. 在 webpack.config.js 的主要配置文件中引入 DllReferencePlugin 插件

```
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');

```

配置 plugin 项，增加对应两个 dll 文件的 .json 文件配置，该配置就是为了告诉当前打包的 webpack,有可以引用的 dll 文件。
```
new DllReferencePlugin({
            // 描述 react 动态链接库的文件内容
            manifest: require('./dist/react.manifest.json'),
        }),
        new DllReferencePlugin({
            // 描述 polyfill 动态链接库的文件内容
            manifest: require('./dist/polyfill.manifest.json'),
        }),
```

3. 在 index.html 中引入打包的 dll 文件

```
<body>
  
  <div id="app"></div>

  <script src="./polyfill.dll.js"></script>
  <script src="./react.dll.js"></script>

  <script src="./bundle.js"></script>
</body>

```

4. 在 package.json 中增加一条 script, 在 build 之前，应当首先执行`npm run dll` 打包 dll 文件。

```
"scripts": {
    "dll": "webpack --config webpack.dll.config.js",
    "start": "webpack-dev-server --mode development",
    "build": "webpack"
  },
```

### 适用情况：

适用于多次引用且变化量不大的模块，并且该模块并不只是引用其子模块的方法，而是整体引用。

### 注意事项:

无


## 使用 HappyPack

### 优化效果：

HappyPack 可以在 webpack 打包时利用多核来开启多个进程，进行并发操作。


### 实现方法：

1. 引入 HappyPack 模块

```
npm i -D happypack
```

2.引入 HappyPack 模块，并通过 HappyPack 的 ThreadPool 方法设定进程池中的子进程个数，以免占用过多资源。得到的 happyThreadPool 参数将在后面的配置中用到。

```
const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: 4 })
```

2. 主要是对 loader 转换进行多进程分派操作。

在 plugin 选项中配置 happypack-loader，将 happyThreadPool 参数赋予threadPool项。

```
new HappyPack({
    // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
    id: 'babel',
    // 如何处理 .js 文件，用法和 Loader 配置中一样
    loaders: ['babel-loader?cacheDirectory'],
    threadPool: happyThreadPool,
}),
new HappyPack({
    id: 'scss',
    // 如何处理 .css 文件，用法和 Loader 配置中一样
    loaders: [{
        loader: 'style-loader',
    },{
        loader: 'css-loader',
        options: {
            modules: true,
            localIdentName: '[path][name]__[local]--[hash:base64:5]'
        }
    },{
        loader: 'sass-loader',
    }],
    threadPool: happyThreadPool,
}),
```

这里配置了两个 happypack-loader,分别用来对 js 与 scss 文件的 loader进行处理，loaders 选项中的配置与 rules 中 loader 的配置一样。id 为唯一识别。

修改 rules值中每项的 use 配置，对应 happypack-loader 的 id:

```
rules: [
            {
                test: /\.js$/,
                use: ["happypack/loader?id=babel"],
                include: path.resolve(__dirname, 'src'),
            },
            {
                test: /\.scss/,
                use: ["happypack/loader?id=scss"],
            },
        ],
```


### 适用情况：

1. 项目庞大，且服务器多核时。

### 注意事项:

1. 与 webpack4 使用时，出现错误：

```
/Users/damz/Desktop/yarsk/node_modules/happypack/lib/WebpackUtils.js:138
    if (resolve.length === 4) {
                ^

TypeError: Cannot read property 'length' of undefined
    at resolveLoader (/Users/damz/Desktop/yarsk/node_modules/happypack/lib/WebpackUtils.js:138:17)
```

官方github issues 未给出解决方法，暂时降低 webpack 版本号。



