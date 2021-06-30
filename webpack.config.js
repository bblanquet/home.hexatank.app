const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const distDir = path.resolve(__dirname, 'dist');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const fs = require('fs');

module.exports = (env) => {
	const variables = Variables(env);
	// Entry point : first executed file
	// This may be an array. It will result in many output files.
	return {
		entry: [ './src/App.tsx' ],
		stats: {
			errorDetails: true // --display-error-details
		},
		// Make errors mor clear
		devtool: 'inline-source-map',
		// Configure output folder and file
		output: {
			path: distDir,
			filename: 'app.js',
			publicPath: variables.root
		},

		optimization: {
			minimizer: [ new UglifyJsPlugin() ]
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
		// What files webpack will manage
		resolve: {
			extensions: [ '.js', '.ts', '.tsx', 'jsx' ]
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
function Variables(env) {
	const vpath = './configuration/' + env.NODE_ENV + '.json';
	console.log('ENV: ' + env.NODE_ENV);
	console.log('ENV PATH: ' + vpath);
	const variables = JSON.parse(fs.readFileSync(vpath));
	console.log('variables: ' + JSON.stringify(variables));
	return variables;
}
