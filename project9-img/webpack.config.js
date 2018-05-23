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
                loader: "babel-loader"
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: [{
                  loader: 'url-loader',
                  options: {
                    // 30KB 以下的文件采用 url-loader
                    limit: 1024 * 30,
                    // 否则采用 file-loader，默认值就是 file-loader 
                    fallback: 'file-loader',
                  }
                }]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
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