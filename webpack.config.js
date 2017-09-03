const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: [
    'webpack/hot/dev-server',
		'webpack-hot-middleware/client?http://localhost:3000/',
    path.join(__dirname, '/client/Route.jsx')
  ],
  output: {
    path : path.resolve(__dirname, 'client', 'dist'),
    filename: 'index.js',
    publicPath: '/dist/'
  },
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
  module: {
    loaders: [
			{
				test: /\.jsx$/,
				exclude: /node_modules/,
				loader: ['react-hot-loader','babel-loader']
			},
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader?modules',
        include: /flexboxgrid/
      }
		]
  }
}
