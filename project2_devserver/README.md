# react + dev-server

使用 react,并加入 dev-server 进行热启动。

### 一、功能介绍：

使用 dev-server 可以将项目放于端口监听，当浏览器访问该端口时，可返回项目文件。这样就不用通过本地预览的方式查看页面了。

### 二、原理解释：

webpack-dev-server 会启动一个 HTTP 服务器用于服务网页请求，同时会帮助启动 Webpack ，并接收 Webpack 发出的文件更变信号，通过 WebSocket 协议自动刷新网页做到实时预览。

webpack-dev-server 基于express实现了一个Http服务器。它的作用主要是用来伺服资源文件。此外这个Http服务器和client使用了websocket通讯协议，原始文件作出改动后，webpack-dev-server会实时的编译，但是最后的编译的文件并没有输出到目标文件夹，因此我们在使用webpack-dev-server启动项目后并不能在 build 目录文件中实时看到输出的 bundle.js

### 三、所需npm包：

```
npm i -D webpack-dev-server
```

### 四、配置方法：

可以使用 cli 命令行方式或者在 webpack.config.js 配置文件中进行相关配置。
要注意有些配置只有 cli命令行方式，具体详见 webpack 官网。

在安装 webpack-dev-server 包之后，启动命令修改为：

```
"start": "webpack-dev-server --mode development"
```

注意： 在 webpack4.0之后，需要指明其运行模式，即命令行配置 --mode development 或者 --mode production, 否则项目启动后会有警告提示。 

//todo: 配置之后的作用

安装 dev-server 包，并且修改启动命令之后执行

```
npm start
```

启动项目即可。

 **主要辅助配置**如下：

在 webpack.config.js 中新增配置项

```
devServer: {
        contentBase: path.join(__dirname, "dist"),
        hot: true,
        open: true,
        historyApiFallback: true,
        compress: true,
        overlay: {
            warnings: true,
            errors: true,
        },
        stats: {
            colors: true
        },
        port: 3001
},
```

* devServer 
  
    对 dev-server 的详细功能进行配置，当项目使用 webpack-dev-server 启动时，这些配置项才会生效。因为这些参数对应的功能是由 dev-server 提供的，因此 webpack 并不认识这些配置参数。

* devServer.contentBase

   在之前的步骤中，项目启动以后打开localhost指定的监听端口，页面并没有跳转到index.html，而是显示了整个文件夹的内容列表。这是因为 webpack-dev-server 默认的提供文件的路径为当前路径，如果打包后的文件在子文件夹，需要配置 contentBase 属性，最好使用绝对路径。

* devServer.open
 
   加载完成后自动打开浏览器。

* devServer.historyApiFallback
 
   对于单页面应用而言，不管浏览器的 url 怎样改变，其返回必须始终为 index.html,因此，最简单的配制方法就是设置该项为 true.

   对于多个单页面组成的应用，可做如下配置：

   ```
   historyApiFallback: {
    // 使用正则匹配命中路由
     rewrites: [
        // /user 开头的都返回 user.html
       { from: /^\/user/, to: '/user.html' },
       { from: /^\/game/, to: '/game.html' },
       // 其它的都返回 index.html
       { from: /./, to: '/index.html' },
    ]
   }
   ```

* devServer.compress

   开启 GZIP 压缩

* devServer.hot

   允许 dev-server 进行局部更新，即并不是刷新整个页面，而是对有修改的组件进行局部刷新。

   如果需要配置该项，则：
   1. 配置 `hot:true`, 并且在插件项中配置webpack.HotModuleReplacementPlugin插件，否则报错。

   ```
   plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
   ```

   2. 直接命令行配置 --hot 启动，则无需配置webpack.HotModuleReplacementPlugin插件。


* devServer.overlay

  当项目出现编译器错误或警告时，在浏览器中显示全屏叠加。配置该项后，项目开发过程中，遇到编译错误时，编辑器控制台报错而页面也会报错，而不是正常加载。

* devServer.stats.color

  输出有颜色标识的日志。

* devServer.port

  指定监听端口号。
   

### 五、注意事项：

1. 两种模式： 

    iframe模式(页面放在iframe中,当发生改变时重载)

    inline模式(将webpack-dev-sever的客户端入口添加到包(bundle)中) 

    // todo: 以下挪到前一节

2. webpack4.0之后 命令行单独分出一个包，webpack-cli, 安装webpack-cli包。 

```
npm install webpack-cli -D
```

如果依然报错，可能是你全局安装了 webpack，但没有全局安装 webpack-cli,全局安装：

```
npm install webpack-cli -g
```



