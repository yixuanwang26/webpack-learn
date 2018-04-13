# vue 集成

简单集成，仅仅使用 vue,未加入 webpack-dev 进行热启动。

### 功能介绍：

在项目中可以使用vue 的模板语法，绑定数据与 dom 元素，即:

1. vue 模板

```
<template>
  <h1>{{ msg }}</h1>
</template>
```

2. 组件逻辑
```
export default {
    data() {
      return {
        msg: 'Hello,Webpack'
      }
    }
  }
```

3. 创建 vue 实例,并将 Card组件渲染为id 为 app的 dom元素上

```
new Vue({
    el:'#app',
    components:{Card}
});
```

### 原理解释：

重点在于如何将.vue的单文件组件进行转换，官方提供了 vue-loader 这个工具，此工具可以将.vue中的模板，样式，以及 js 代码提取出来，交给各自对应的 loader,模板文件较给vue-template-compiler，css文件较给css-loader。

### 所需npm包：
1. 首先使用 vue 需要安装 vue 包：

```
npm i vue
```
2. 需要安装对单个组件.vue 文件进行转换的 vue-loader，以及vue-template-compiler和css-loader。

```
npm i -D vue-loader  vue-template-compiler  css-loader
```

### 注意事项：

1. vue-loader版本需和vue-template-compiler版本一致。

2. 仍需配置 babel,转换 es5, es6 语法



