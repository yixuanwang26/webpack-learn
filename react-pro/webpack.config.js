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
                use: ["babel-loader?cacheDirectory"],
                include: path.resolve(__dirname, 'src'),
            },
            {
                test: /\.scss/,
                // SCSS 文件的处理顺序为先 sass-loader 再 css-loader 再 style-loader
                use: [
                    {
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
                    },
                    ],
            },
        ],
        noParse: [/react\.min\.js$/],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    resolve: {
        // 使用绝对路径指明第三方模块存放的位置，以减少搜索步骤
        // 其中 __dirname 表示当前工作目录，也就是项目根目录
        modules: [path.resolve(__dirname, 'node_modules')],
        alias: {
            'react-dom': path.resolve(__dirname, './node_modules/react-dom/dist/react-dom.min.js'),
            'react': path.resolve(__dirname, './node_modules/react/dist/react.min.js'),
        },
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