var webpack = require('webpack');
var path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'lib'),
        // 输出的代码符合 CommonJS 模块化规范，以供给其它模块导入使用。
        libraryTarget: 'commonjs2',
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
                use: ['style-loader','css-loader'] // 压缩 CSS 代码
                // // 提取出 Chunk 中的 CSS 代码到单独的文件中
                // use: ExtractTextPlugin.extract({
                //     use: ['css-loader'] // 压缩 CSS 代码
                // }),
            },
        ]
    },
    plugins: [
        // new ExtractTextPlugin({
        //     filename: `index.css`,// 给输出的 CSS 文件名称加上 Hash 值
        // }),
    ],
    // 输出 source-map 方便直接调试 ES6 源码
    devtool: 'source-map',
    externals: /^(react|react-dom|babel-runtime)/,
};