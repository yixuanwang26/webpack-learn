# react 项目组件发布至 npm 


### 一、功能介绍：

发布普通组件至 npm,之后install 并且引入其他项目。

### 二、原理解释：



### 三、所需npm包：

1. webpack 基础包
2. css-loader,style-loader
3. babel

### 四、配置方法：

1. 在 output 配置中添加：
```
libraryTarget: 'commonjs2',
```

该项规定了打包之后，允许其他文件引入的方式。
具体有几种：

* var(默认)

如果配置了 libraryTarget: 'commonjs2', 则会如下打包输出内容：
```
var LibraryName = lib_code;
```

引用时，则：
```
LibraryName.doSomething();
```

* commonjs

输出时：
```
exports['LibraryName'] = lib_code;
```

引用时：
```
require('library-name-in-npm')['LibraryName'].doSomething();
```

* commonjs2

输出时：
```
module.exports = lib_code;
```
引用时：
```
require('library-name-in-npm').doSomething();
```

2. 加入`externals: /^(react|react-dom|babel-runtime)/`配置，该项是告诉 webpack,在打包时，不要将这些项进行打包，在外部项目引用时，直接从外部项目的模块中引用。

3. .babelrc 配置中加入

```
"plugins": [
      [
        "transform-runtime",
        {
          "polyfill": false
        }
      ]
],
```

这里配置的 transform-runtime 是为了当 babel 转换 ES6 语法时，所依赖的方法并不重复写入，而是统一到一个文件中进行 require 引入。全名为 babel-plugin-transform-runtime， 主要需要和 babel-runtime 一起使用。

其次，这里配置 polyfill 为 false，即用户需要装什么 polyfill 由其自己决定。

4. 在 package.json 中添加
```
"main": "lib/index.js",
"jsnext:main": "src/index.js",
```

main 表示代码入口，jsnext:main 表示 es6 的代码入口。

5. 配置好之后 build, 然后在 npm 官方网站进行账号注册，之后在本地命令行使用`npm login`登录，然后在项目文件夹下 `npm publish` 进行发布。

注意 package.json 中的 name 即为包名。

### 五、注意事项：

1. 如果想要发布之后的组件自带样式文件，则建议不要把样式文件单独打包。

2. 更新一个 npm 包时只需修改打包，然后修改 package.json 中的版本号，之后仍然使用`npm publish`进行发布。

3. 撤销一个 npm 包时，`npm unpublish 包名 --force`, 撤销之后下次发布时不能再使用相同包名及相同版本号。并且撤销行为只在24小时内有效。




