# eslint 集成

### 功能介绍：

1. 使用 eslint 配置文件进行规则配置。
2. 使用 eslint 校验单个文件。
3. 使用 eslint 集成至 webapck，在打包时进行全部文件校验。
4. 使用 husky 配置为在 git 提交时进行校验。

### 原理解释：

### 所需npm包：
1. eslint， 可以安装在本地或全局
```
npm i eslint -D // 本地
npm i eslint -g // 全局
```
本地与全局的区别在于，安装在全局之后可以在任意文件夹校验任意js,css文件, 当运行 eslint 命令进行检验时，首先会根据当前文件夹中的配置文件进行，如果没有找到该配置文件，则会去根据主目录的配置文件来进行校验。

2. 由于本项目使用了 react 模块，因此需要安装 eslint-plugin-react 模块，要注意，如果 eslint 安装在本地则该插件需要安装在本地，如果 eslint 安装在全局，则该插件也要安装在全局。
如果使用 eslint --init 初始化 eslint 文件时，选择使用 react 后该插件会自动安装。

### 配置方法：
1. 安装好 eslint 包后，在对应文件夹执行 eslint --init, 然后根据提示进行配置。

本项目配置如下：

```
? How would you like to configure ESLint? Answer questions about your style
? Are you using ECMAScript 6 features? Yes
? Are you using ES6 modules? Yes
? Where will your code run? Browser
? Do you use CommonJS? Yes
? Do you use JSX? Yes
? Do you use React? Yes
? What style of indentation do you use? Spaces
? What quotes do you use for strings? Single
? What line endings do you use? Unix
? Do you require semicolons? Yes
? What format do you want your config file to be in? JSON
```
 
之后可以在项目看到生成了.eslintrc.json 文件

其中对语法的规则最主要是以下配置：
```
"rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
```
每一项的第一个参数为检查等级，可配置的三种选项:

"off" 或 0 - 关闭规则
"warn" 或 1 - 开启规则，使用警告级别的错误：warn (不会导致程序退出)
"error" 或 2 - 开启规则，使用错误级别的错误：error (当被触发的时候，程序会退出)

第二项为该配置项的值。

例如：quotes表示引号使用单引号还是双引号，此处配置为单引号。

2. 对项目内的单个文件进行检查，例如：
```
eslint ./src/index.js
```

检查当前项目中的 index.js 文件。

3. webpack 引入 eslint 只需增加 eslint-loader, 引入时注意，loader 的顺序必须为 eslint-loader 在最前检查。

```
rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/, 
                loader: ["babel-loader","eslint-loader"]
            }
        ]
```

4. 在 git 提交时进行代码检查，需要 husky 模块：

```
npm i -D husky
```

之后在 package.json 中增加 script 语句:

```
"precommit": "npm run lint",
"lint": "eslint"
```

或者可以在 push 时进行检查，即，将`precommit`行替换为

```
"prepush": "lint",
```



### 注意事项：

1. 配置
```
"extends": "eslint:recommended"
```

表明启用了一系列核心规则，这些规则报告一些常见问题，具体的规则参考http://eslint.cn/docs/rules/

2. react语法检查时，发现对引入的子组件报错为该引入未使用，在 plugins 配置项中增加 eslint-plugin-react插件的规则

```
"extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
```

3. react 语法检查插件要求检查 props 传入类型，因此加入 PropTypes 类型检查，注意PropTypes已经被从React里deprecated掉了，虽然 react 中可用，但语法检查会出错，因此使用包prop-types引入。





