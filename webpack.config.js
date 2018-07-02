const path = require('path');
const uglify = require('uglifyjs-webpack-plugin'); // js压缩
const htmlPlugin = require('html-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');

const website = {
    publicPath: "localhost:1070"
}
module.exports = {
    //入口文件的配置项：单一入口或者多入口
    entry: {
        entry: './src/entry.js'
    },
    //出口文件的配置项，webpack2.X版本后，支持多出口配置
    output: {
        //打包的路径文职
        path: path.resolve(__dirname, 'dist'),
        //打包的文件名称
        filename: '[name].js',
        publicPath: './'
    },
    //模块：例如解读CSS，图片如何转换，压缩
    //test: 匹配对应文件的后缀名称 
    //use：指定使用的loader和loader的配置参数
    module: {
        rules: [
            {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: "css-loader",
                            options: {
                                importLoaders: 1
                            }
                        },
                        {
                            loader: "postcss-loader"
                        }

                    ]
                })
            },
            {
                test: /\.scss$/,
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: ["css-loader", "sass-loader"]
                })
                
            },
            {
                test: /\.(png|jpg|gif)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 500000, //小于500000B的文件打成base64的格式，写入JS
                        outputPath: 'images/' //大于limit值的图片打包到images
                    }
                }]
            },
            {
                test: /\.(html|htm)$/i,
                use: ['html-withimg-loader']
            }
        ]
    },
    //插件，用于生成模板和各项功能
    plugins: [
        new uglify(), // js压缩
        new htmlPlugin({
            //对HTML文件进行压缩
            minify: {
                removeAttributeQuotes: true //去掉属性的双引号
            },
            //避免缓存js
            hash: true,
            //要打包的Html模板路径和文件名称
            template: './src/index.html'
        }),
        new extractTextPlugin("css/index.css") //分离css到index.css
    ],
    //配置webpack开发服务功能
    devServer: {
        //设置基本目录结构
        contentBase: path.resolve(__dirname, 'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host: 'localhost',
        //服务端压缩是否开启
        compress: true,
        //配置服务端口号
        port: 1070

    }
}