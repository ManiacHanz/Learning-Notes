const common = require('./webpack.common.js')
const { merge } = require('webpack-merge')
const webpack = require('webpack')

module.exports = merge(common, {
	mode: 'development',
	devtool: 'source-map',
	devServer: {
		contentBase: './dist',
		// hot: true,
	},
	plugins: [new webpack.HotModuleReplacementPlugin()],
})
