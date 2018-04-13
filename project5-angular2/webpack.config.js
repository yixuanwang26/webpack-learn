var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: './src/main',
    output: {
        path: __dirname + '/dist',
        filename: 'bundle.js'
    },
    resolve: {
        // 先尝试 ts，tsx 后缀的 TypeScript 源码文件
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    // 输出 source-map 方便直接调试 ES6 源码
    devtool: 'source-map',
};