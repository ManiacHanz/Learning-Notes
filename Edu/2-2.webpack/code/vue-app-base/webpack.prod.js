const common = require('./webpack.common.js')
const { merge } = require('webpack-merge')
const {
	CleanWebpackPlugin,
} = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

module.exports = merge(common, {
	mode: 'production',
	output: {
		path: path.join(__dirname, 'dist/assets'),
		publicPath: 'assets/',
		filename: '[name].[contenthash:8].js',
	},
	optimization: {
		splitChunks: {
			chunks: 'async',
		},
	},
	plugins: [
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: '自定义webpack项目',
			// favicon: path.join(__dirname, 'public/favicon.ico'),
			templateParameters: {
				BASE_URL: './public/',
			},
			template: './public/index.html',
			filename: '../index.html'
		})
	],
})
