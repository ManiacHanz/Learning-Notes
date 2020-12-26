const common = require('./webpack.common.js')
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(common, {
	mode: 'development',
	devtool: 'source-map',
	devServer: {
		contentBase: path.resolve(__dirname),
		// contentBase: path.resolve(__dirname),

		port: 8000,
		hot: true,
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			title: '自定义webpack项目',
			// favicon: path.join(__dirname, 'public/favicon.ico'),
			templateParameters: {
				BASE_URL: './public/',
			},
			template: './public/index.html',

		})
		
	],
})
