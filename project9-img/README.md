# 图片加载

转换通过 import 方式导入js的图片资源。

### 一、功能介绍：

通过 url-loader，与 file-loader 来转换通过 import 方式导入 js 的图片资源。

### 二、原理解释：

1. file-loader 用来将 import 进 js 的图片资源转换为打包后的图片资源路径，例如该项目中Card 组件中的

```
import img from '../assets/redA.jpeg';
```

转换以后为

```
module.exports = __webpack_require__.p + "75bc6cf34c41e3851d870f30dc4defc2.jpeg";
```
同时打包目录下会将该资源命名为与引入名相同的名字。

2. url-loader 会将 import 进 js 的图片资源进行编码，之后将图片内容计算出的 base64 编码的字符串直接注入 import 的位置，例如该项目中 index.js 中的

```
import layer from './assets/layer.png';
```

转换后为

```
module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAM...";
```

3. 一般较小的文件我们使用后一种方式用 url-loader 打包，因为为了较小的资源文件再去请求一次服务器会浪费性能，这部分可以直接打包在引入处，对于较大文件，我们使用 file-loader 单独打包，然后单独引入。


### 三、所需npm包：

```
npm i -D file-loader url-loader
```

### 四、配置方法：
 
1. 安装模块之后，修改 webpack 的配置文件，在 rule 中增加对图片资源的 loader:

```
{
    test: /\.(png|jpg|jpeg|gif|svg)$/,
    use: [{
        loader: 'url-loader',
        options: {
            // 30KB 以下的文件采用 url-loader
            limit: 1024 * 30,
            // 否则采用 file-loader，默认值就是 file-loader 
            fallback: 'file-loader',
        }
    }]
}
```

如果超出 limit 设置的大小限制，则会使用 fallback 设置的 loader 打包文件。


   

### 五、注意事项：

1. 在 css 中引入图片资源时如下所示：

```
#app {
  background-image: url(./imgs/a.png);
}
```
以上配置在打包时对其影响与 js 文件一致。


