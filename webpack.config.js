'use strict';

var HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
var distDir = path.resolve(__dirname, 'dist');
var webpack = require('webpack');

module.exports = env => {
    // Entry point : first executed file
    // This may be an array. It will result in many output files.
    return {entry: ['./src/main.tsx'],
    stats: {
        errorDetails: true, // --display-error-details
    },
    // What files webpack will manage
    resolve: {
        extensions: ['.ts', '.tsx']
    },

    // Make errors mor clear
    devtool: 'inline-source-map',

    // Configure output folder and file
    output: {
        path: distDir,
        filename: 'main.js',
    },

    resolve: {
      extensions: ['.js','.ts', '.tsx','jsx']
    },
    module: {
        rules: [
            {
                test: /SpriteProvider\.ts$/,
                loader: 'string-replace-loader',
                options: {
                  search: '{{}}',
                  replace: env.NODE_ENV === 'pc' ? '/' : '/android_asset/www/',
                  flags:'g'
                }
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            },
            {
                test: /\.css$/,
                loader: 'string-replace-loader',
                options: {
                  search: '{{}}',
                  replace: env.NODE_ENV === 'pc' ? '/' : '/android_asset/www/',
                  flags:'g'
                }
            },


        ]
    },

    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
        new CopyPlugin([
            { from: './Resources', to: '' },
        ]),
    ]
}
};