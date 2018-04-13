# react 集成

简单集成，仅仅使用 react,未加入 webpack-dev 进行热启动。

### 功能介绍：

在项目中可以使用react的JSX语法，即:

1. react 渲染方法

```
ReactDom.render(
  <div>hello,react.</div>,
  document.getElementById('app')
)
```

2. 继承 React.Component,构建 React 组件
```
export class Card extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        console.log('已完成渲染');
    }
    render() {
        return (
            <div>
                <p>yahahah~~</p>
                <p>{this.props.name},恭喜你~ 找到我</p>
            </div>
        )
    }
}
```

在 react 的项目中，JSX语法并不是必须的，react 原生支持的语法是这样的
```
React.createElement('h1', null, 'Hello,Webpack')
```

但是使用JSX语法，可以让我们的 react 项目语句更优美，更能直观体现其功能，所以，一般而言都使用 JSX 语法。支持 JSX 语法需要配置 babel.

### 原理解释：
babel可以将 JSX 语法转换为一般的 javascript 语法，如上面所示
```
// jsx 语法
ReactDom.render(
  <div>hello,react.</div>,
  document.getElementById('app')
)

// javascript 语法
ReactDom.render(React.createElement(
  'div',
  null,
  'hello,react.'
), document.getElementById('app'));

```
### 所需npm包：
1. 首先使用 react 需要安装 react 包，包括：
```

npm i -D react react-dom
```
### 多种配置方法：
### 注意事项：

