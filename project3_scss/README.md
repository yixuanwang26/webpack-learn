# react + dev-server + scss

在之前的项目基础上增加 scss

### 一、功能介绍：


### 二、原理解释：



### 三、所需npm包：

```
npm i -D css-loader
npm i -D node-sass
npm i -D sass-loader
npm i -D style-loader
```

### 四、配置方法：
css modules 的配置方法：

在css-loader 中配置其配置项module为 true,并可配置其命名规则 
// todo 具体各 loader 的配置项中重要内容

### 五、注意事项：

css modules 和普通css 最大的区别在于：

css modules 使用

    ```
    import style from './App.css';

    <h1 className={style.title}>
      Hello World
    </h1>
    ```
`className`这样的方式引入样式，样式文件为：

```
.title {
  color: red;
}
```

在构建时使用构建工具将style.title转换为一个哈希字符串，同时 css 也会被编译。因此这个样式就会是全局唯一的样式。

如果不使用 css modules,如下引入 css

    ```
    import style from './App.css';

    <h1 className="title">
      Hello World
    </h1>
    ```
则该 css样式全局有效。



