import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin';

const src  = path.resolve(__dirname, 'src')
const dist = path.resolve(__dirname, 'dist')

export default {
	mode: 'development',
	entry: src + '/index.tsx',

	output: {
		path: dist,
		filename: 'bundle.js'
	},

	module: {
		rules: [
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				loader: 'babel-loader'
			},
			{
				test: /\.(sa|sc|c)ss$/,
				exclude: /node_modules/,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: 'ts-loader',
			},
		]
	},

	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: src + '/index.html',
			filename: 'index.html'
		})
	]
}
