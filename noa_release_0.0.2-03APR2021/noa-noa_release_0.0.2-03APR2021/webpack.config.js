var path = require('path');

module.exports = {
    entry: './src/main/js/index.js',
    devtool: 'sourcemaps',
    cache: true,
	mode: 'development',
    resolve: {
        alias: {
            'stompjs': __dirname + '/node_modules' + '/stompjs/lib/stomp.js',
        },
		extensions: ['.js', '.json', '.ts', '.tsx']
    },
    output: {
        path: __dirname,
        filename: './src/main/resources/static/built/bundle.js'
    },
	module: {
		rules: [
			{
				test: path.join(__dirname, '.'),
				exclude: /(node_modules)/,
				use: [{
					loader: 'babel-loader',
					options: {
						presets: ["@babel/preset-env", "@babel/preset-react", "@babel/preset-flow"]
					}
				}]
			},
			{ 
				test: /\.css$/, 
				use: ['style-loader', 'css-loader', 'resolve-url-loader'], 
				include: [ path.join(__dirname, 'src'), /node_modules/ ],
			},
			{
				test: /\.(png|woff|woff2|eot|ttf|svg)$/,
				loader: 'url-loader'
			},
		]
	}
};