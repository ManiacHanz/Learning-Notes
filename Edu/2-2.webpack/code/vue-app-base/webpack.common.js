const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	mode: 'none',
	entry: path.join(__dirname, 'src/main.js'),
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].[contenthash:8].js',
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				use: 'vue-loader',
			},
			// 它会应用到普通的 `.js` 文件
			// 以及 `.vue` 文件中的 `<script>` 块
			{
				test: /\.js$/,
				use: 'babel-loader',
			},
			// 它会应用到普通的 `.css` 文件
			// 以及 `.vue` 文件中的 `<style>` 块
			{
				test: /\.css$/,
				use: ['vue-style-loader', 'css-loader'],
			},
			{
				test: /\.less$/,
				// use: ExtractTextPlugin.extract({
				// 	fallback: 'style-loader',
				// 	use: ['css-loader', 'less-loader'],
				// }),
				use: [
					'style-loader', // creates style nodes from JS strings
					'css-loader', // translates CSS into CommonJS
					'less-loader', // compiles Less to CSS
				],
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 4 * 1024,
							esModule: false,
						},
					},
				],
			},
		],
	},
	plugins: [
		// 请确保引入这个插件！
		new VueLoaderPlugin(),
		new CleanWebpackPlugin(),
		new HtmlWebpackPlugin({
			title: '自定义webpack项目',
			// favicon: path.join(__dirname, 'public/favicon.ico'),
			templateParameters: {
				BASE_URL: './',
			},
			template: './public/index.html',
		}),
		// new ExtractTextPlugin({
		// 	filename: '[name].css',
		// }),
	],
}
