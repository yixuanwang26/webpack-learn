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