var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')

var BUILD_DIR = path.resolve(__dirname, 'sm_spy/static/public');
var APP_DIR = path.resolve(__dirname, 'sm_spy/static/src');

var config = {
    module : {
        rules: [
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: "css-loader"
            })
          },
          {
            test: /\.scss$/,
            use: extractSass.extract({
                use: [{
                    loader: "css-loader"
                }, {
                    loader: "sass-loader"
                }],
                fallback: "style-loader"
            })
          },
          {
            test :  /\.tsx?$/,
            include : APP_DIR,
            loader : 'awesome-typescript-loader'
          },
          {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url-loader?limit=10000&mimetype=application/font-woff'
          },
          {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'file-loader'
          }
        ],
    },
    externals: {
        // "react": "React",
        // "react-dom": "ReactDOM"
    },
    entry: APP_DIR + '/app.tsx',
    output: {
        path: BUILD_DIR + '/js',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
      plugins: [
        new ExtractTextPlugin("../css/styles.css"),
        new UglifyJSPlugin(),
      ]
};

module.exports = config;