const webpack = require('webpack');
const nodeEnv = process.env.NODE_ENV || 'production';
const path = require('path');
const devServerPort = 9090;

module.exports = {
    entry: {
        app: path.resolve('./src/app.js')
    },
    output: {
        path: path.resolve('./build'),
        filename: "bundle.js"
    },
    devtool: "source-map",
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015-native-modules']
                }
            },
            {
                test: /\.css$/,
                loader: ["style-loader", "css-loader", "resolve-url-loader"]
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader?limit=8192'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'proccess.env': {NODE_ENV: JSON.stringify(nodeEnv)}
        })
    ],
    devServer: {
        port: devServerPort,
        inline: false,
        colors: true
    }
};
