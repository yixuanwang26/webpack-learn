var webpack = require('webpack');
var path = require('path');
const HappyPack = require('happypack');
const { WebPlugin } = require('web-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
const UglifyESPlugin = require('uglifyjs-webpack-plugin');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');


const happyThreadPool = HappyPack.ThreadPool({ size: 4 })

var ENV = process.env.NODE_ENV;
var isProd = ENV === 'production';

var basePlugin = [
    new CleanWebpackPlugin([
        'dist/app_*.*',
        'dist/index.html'
    ]),
    new WebPlugin({
        template: './src/template.html', // HTML 模版文件所在的文件路径
        filename: 'index.html', // 输出的 HTML 的文件名称
        requires: ['app']
    }),
    new ExtractTextPlugin({
        filename: isProd ? '[name]_[contenthash:8]_bundle.css' : '[name]_bundle.css',// 给输出的 CSS 文件名称加上 Hash 值
    }),
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
            loader: 'css-loader',
            options: {
                // 注：在css-loader加载之前还有几个loader需要加载
                importLoaders: 1,
                // 注：是否开启modules
                modules: true,
                // 转化类名时的规则
                localIdentName: '[path]__[name]__[local]__[hash:base64:5]',
            }
        },
        {
            loader: 'sass-loader'
        }],
        threadPool: happyThreadPool,
    }),
    new DllReferencePlugin({
        // 描述 react 动态链接库的文件内容
        manifest: require('./dist/react.manifest.json'),
    }),
    new DllReferencePlugin({
        // 描述 polyfill 动态链接库的文件内容
        manifest: require('./dist/polyfill.manifest.json'),
    })
];

var prodPlugin = [
    new webpack.DefinePlugin({
        "process.env": {
            // This has effect on the react lib size
            "NODE_ENV": JSON.stringify("production")
        }
    }),
    // 使用 UglifyJsPlugin 压缩输出的 JavaScript 代码(ES5)
    // new UglifyJsPlugin({
    //     // 最紧凑的输出
    //     beautify: false,
    //     // 删除所有的注释
    //     comments: false,
    //     sourceMap: true,
    //     compress: {
    //         // 在UglifyJs删除没有用到的代码时不输出警告
    //         warnings: false,
    //         // 删除所有的 `console` 语句，可以兼容ie浏览器
    //         drop_console: true,
    //         // 删除debugger
    //         drop_debugger: true,
    //         // 内嵌定义了但是只用到一次的变量
    //         collapse_vars: true,
    //         // 提取出出现多次但是没有定义成变量去引用的静态值
    //         reduce_vars: true,
    //     }
    // })
    // 使用UglifyESPlugin 压缩 js 代码（ES6）
    new UglifyESPlugin({
        uglifyOptions: {
          compress: {
            // 在UglifyJs删除没有用到的代码时不输出警告
            warnings: false,
            // 删除所有的 `console` 语句，可以兼容ie浏览器
            drop_console: true,
            // 内嵌定义了但是只用到一次的变量
            collapse_vars: true,
            // 提取出出现多次但是没有定义成变量去引用的静态值
            reduce_vars: true,
          },
          output: {
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
          }
        },
        sourceMap: true
    })
]

var devPlugin = [
    new webpack.HotModuleReplacementPlugin(),
]

module.exports = {
    entry: {
        app: './src/index.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: isProd ? '[name]_[hash:8]_bundle.js' : '[name]_bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["happypack/loader?id=babel"],
                include: path.resolve(__dirname, 'src'),
            },
            {
                test: /\.scss/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: "happypack/loader?id=scss",
                }),
            },
        ],
        // noParse: [/react\.min\.js$/],
    },
    plugins: isProd ? basePlugin.concat(prodPlugin) : basePlugin.concat(devPlugin),
    resolve: {
        // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
        modules: [path.resolve(__dirname, 'node_modules')],
        // alias: {
        //     'react-dom': path.resolve(__dirname, './node_modules/react-dom/dist/react-dom.min.js'),
        //     'react': path.resolve(__dirname, './node_modules/react/dist/react.min.js'),
        // },
        extensions: ['.js'],
        modules: [path.resolve(__dirname, 'node_modules')]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        hot: isProd ? false : true,
        open: true,
        historyApiFallback: true,
        overlay: {
            warnings: true,
            errors: true,
        },
        port: 3001
    },
    // watch: true,
    watchOptions: {
        // 不监听的文件或文件夹，支持正则匹配
        ignored: /node_modules/,
        // 监听到变化发生后会等300ms再去执行动作，防止文件更新太快导致重新编译频率太高
        aggregateTimeout: 300,
        // 判断文件是否发生变化是通过不停的去询问系统指定文件有没有变化实现的
        poll: 1000
    },
    // 输出 source-map 方便直接调试 ES6 源码
    devtool: 'source-map',
};