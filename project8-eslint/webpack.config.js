var webpack = require('webpack');
var path = require('path');

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
                exclude: /node_modules/, 
                loader: ["babel-loader","eslint-loader"]
            }
        ]
    },
    // 输出 source-map 方便直接调试 ES6 源码
    devtool: 'source-map',
};