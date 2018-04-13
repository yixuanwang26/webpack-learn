var webpack = require('webpack');
var path = require('path');
const { WebPlugin } = require('web-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js'// Chunk app 的 JS 执行入口文件
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name]_[hash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css/,// 增加对 CSS 文件的支持
                // 提取出 Chunk 中的 CSS 代码到单独的文件中
                use: ExtractTextPlugin.extract({
                    use: ['css-loader'] // 压缩 CSS 代码
                }),
            },
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new WebPlugin({
            template: './src/template.html', // HTML 模版文件所在的文件路径
            filename: 'index.html', // 输出的 HTML 的文件名称
            requires: ['app']
        }),
        new ExtractTextPlugin({
            filename: `[name]_[contenthash:8].css`,// 给输出的 CSS 文件名称加上 Hash 值
        }),
    ],
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
    // 输出 source-map 方便直接调试 ES6 源码
    devtool: 'source-map',
};