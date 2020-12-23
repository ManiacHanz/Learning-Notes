const common = require('./webpack.common.js')
const { merge } = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')

module.exports = merge(common, {
	mode: 'development',
	devtool: 'source-map',
	devServer: {
		// contentBase: './dist',
		contentBase: path.resolve(__dirname),
		port: 8000,
		hot: true,
	},
	plugins: [new webpack.HotModuleReplacementPlugin()],
})
