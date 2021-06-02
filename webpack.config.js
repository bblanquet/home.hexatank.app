var HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
var distDir = path.resolve(__dirname, 'dist');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const fs = require('fs');

module.exports = (env) => {
	var vpath = './configuration/' + env.NODE_ENV + '.json';
	console.log('ENV: ' + env.NODE_ENV);
	console.log('ENV PATH: ' + vpath);
	var variables = JSON.parse(fs.readFileSync(vpath));
	console.log('variables: ' + JSON.stringify(variables));
	// Entry point : first executed file
	// This may be an array. It will result in many output files.
	return {
		entry: [ './src/main.tsx' ],
		stats: {
			errorDetails: true // --display-error-details
		},
		// Make errors mor clear
		devtool: 'inline-source-map',
		// Configure output folder and file
		output: {
			path: distDir,
			filename: 'main.js',
			publicPath: variables.root
		},

		optimization: {
			minimizer: [ new UglifyJsPlugin() ]
		},
		// What files webpack will manage
		resolve: {
			extensions: [ '.js', '.ts', '.tsx', 'jsx' ]
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					loader: 'ts-loader'
				},
				{
					test: /\.svg$/,
					loader: 'svg-inline-loader'
				},
				{
					test: /\.(scss|css)$/,
					use: [ 'style-loader', 'css-loader' ]
				},
				{
					test: /\.otf$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: '[name].[ext]',
								outputPath: 'fonts/'
							}
						}
					]
				},
				{
					test: /\.(scss|css|ts|tsx)$/,
					loader: 'string-replace-loader',
					options: {
						multiple: variables.keys
					}
				}
			]
		},
		devServer: {
			historyApiFallback: true
		},
		plugins: [
			new CleanWebpackPlugin(),
			new HtmlWebpackPlugin({
				template: 'src/index.html'
			}),
			new CopyPlugin([ { from: './asset', to: '' } ])
		]
	};
};
