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
                loader: "style-loader!css-loader"
            }
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {warnings: false},
            output: {comments: false},
            sourceMap: true
        }),
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
