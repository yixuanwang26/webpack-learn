var webpack = require('webpack');
var path = require('path');
const { AutoWebPlugin } = require('web-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// 使用本文的主角 AutoWebPlugin，自动寻找 pages 目录下的所有目录，把每一个目录看成一个单页应用
const autoWebPlugin = new AutoWebPlugin('page', {
    template: './template.html', // HTML 模版文件所在的文件路径
    postEntrys: ['./common.css'],// 所有页面都依赖这份通用的 CSS 样式文件
    // 提取出所有页面公共的代码
    commonsChunk: {
        name: 'common',// 提取出公共代码 Chunk 的名称
    },
});

module.exports = {
    entry: autoWebPlugin.entry({
        // 这里可以加入你额外需要的 Chunk 入口
    }),
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name]_[hash:8].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: ["babel-loader"],
                exclude: path.resolve(__dirname, 'node_modules'),
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
        autoWebPlugin,
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin({
            filename: `[name]_[contenthash:8].css`,// 给输出的 CSS 文件名称加上 Hash 值
        }),
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        hot: true,
        open: true,
        historyApiFallback: {
            rewrites: [
                { from: /^\/login/, to: '/login.html' },
                { from: /^\/index/, to: '/index.html' },
                // 其它的都返回 index.html
                { from: /./, to: '/index.html' },
              ]
        },
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
    // devtool: 'source-map',
};