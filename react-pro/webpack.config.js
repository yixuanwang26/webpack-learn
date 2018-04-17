var webpack = require('webpack');
var path = require('path');
const HappyPack = require('happypack');
const DllReferencePlugin = require('webpack/lib/DllReferencePlugin');
const happyThreadPool = HappyPack.ThreadPool({ size: 4 })
module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
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
                // SCSS 文件的处理顺序为先 sass-loader 再 css-loader 再 style-loader
                use: ["happypack/loader?id=scss"],
                // use: [{
                //     loader: 'style-loader',
                // },
                // {
                //     loader: 'css-loader',
                //     options: {
                //         modules: true,
                //         localIdentName: '[path][name]__[local]--[hash:base64:5]'
                //     }
                // },
                // {
                //     loader: 'sass-loader',
                // }]
            },
        ],
       // noParse: [/react\.min\.js$/],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
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
            },
            {
                loader: 'css-loader',
                options: {
                    modules: true,
                    localIdentName: '[path][name]__[local]--[hash:base64:5]'
                }
            },
            {
                loader: 'sass-loader',
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
        }),
    ],
    resolve: {
        // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
        // 其中 __dirname 表示当前工作目录，也就是项目根目录
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
        hot: true,
        open: true,
        historyApiFallback: true,
        overlay: {
            warnings: true,
            errors: true,
        },
        port: 3001
    },
    // 输出 source-map 方便直接调试 ES6 源码
    devtool: 'source-map',
};