const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const webpack = require('webpack');

extractCSS = new ExtractTextPlugin("style.css");

module.exports = {
	entry: {
		main: "./app.js",
		vendor:["vue"],
	},
	output:{
		path: path.resolve(__dirname, './public'),
		filename:"[name].bundle.js"
	},

	module: {
		rules : [
			{
				test:/\.js$/,
				loader:"babel-loader",
				options:{
					"presets": ["env"],
					"plugins": ["transform-object-rest-spread"]
				},
				exclude : /node_modules/
			},
			{
				test:/\.css$/,
				loader:extractCSS.extract({
					fallback: 'style-loader',
					use: 'css-loader!sass-loader'
				})
			},
			{
				test: /\.scss$/,
				loader:extractCSS.extract({
					fallback: 'style-loader',
					use: 'css-loader!sass-loader'
				})
			},
			{
        		test: /\.vue$/,
        		loader: 'vue-loader',
				options: {
					cssModules: {
						localIdentName: '[path][name]---[local]---[hash:base64:5]',
						camelCase: true
					},
					loaders:{
						js: 'babel-loader?{"presets":["es2017"], "plugins": ["transform-object-rest-spread"]}',

						css: extractCSS.extract({
							use: 'css-loader',
							fallback: 'style-loader'
						}),
						sass: extractCSS.extract({
							use:'css-loader!sass-loader',
							fallback: 'style-loader'
						})
					}
				}
        	},
			{
				test: /\.(woff|woff2|svg|eot|ttf|otf)$/,
				loader: 'file-loader?name=static/font/[name].[ext]?[hash]',

			},
        	{
        		test: /\.(png|jpg|gif|svg)$/,
      		 	loader: 'url-loader?limit=8192&name=static/img/[name].[ext]?[hash]',
      		},
			{
				test: /\.(html|tpl)$/,
				loader: 'html-loader'
			},
		]
	},

	resolve: {
		alias: {
			'vue$': 'vue/dist/vue'
		},
		extensions: ['.js', '.vue'],
	},
	plugins :[

		extractCSS,
		new CommonsChunkPlugin({
			name:['commons','vendor','bootstrap']
		}),
		new HtmlWebpackPlugin({
			template:path.join(__dirname,'index.html'),
			filename: './index.html'

		}),
		new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: "'production'"
            }
		})

	]
}