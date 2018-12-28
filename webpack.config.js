'use strict';

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');

var distDir = path.resolve(__dirname, 'dist');

module.exports = {
    // Entry point : first executed file
    // This may be an array. It will result in many output files.
    entry: ['./src/main.ts', './src/Resources/images.png', './src/Resources/Program6.json'],

    // What files webpack will manage
    resolve: {
        extensions: ['.js', '.ts', '.tsx','.json','.png']
    },

    // Make errors mor clear
    devtool: 'inline-source-map',

	
    // Configure output folder and file
    output: {
        path: distDir,
        filename: 'main_bundle.js',
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                  'url-loader?limit=10000',
                  'img-loader']
            }
        ]
    },

    devServer: {
        contentBase: './dist'
    },


    plugins: [
        new CleanWebpackPlugin([distDir]),
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        })
    ]
};