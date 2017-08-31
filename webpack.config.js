const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const autoprefixer = require('autoprefixer');

const paths = require('./paths');

let outputPath = paths.outputDevPath;
let devTool = 'source-map';

const PROD = process.env.ENV_PROD || 0;
console.log('PROD', process.env.ENV_PROD);

// variables shared
const env = {
	prod : PROD
};

const plugins = [
	// Avoid publishing files when compilation failed
	new webpack.NoEmitOnErrorsPlugin(),
	new FriendlyErrorsWebpackPlugin()
];

// conditional loader
const loaders = [
	{
		test: /\.js$/,
		exclude: /(node_modules|bower_components)/,
		loader: 'babel-loader', // 'babel-loader' is also a valid name to reference
		query: {
			presets: ['es2015', 'stage-0']
		}
	},
	{test: /\.json$/, loader: 'json-loader'}
]

let filename = 'assets/js/bundle.js';

if (PROD) {

	plugins.push(
        // new webpack.optimize.DedupePlugin(),
        // new webpack.optimize.OccurenceOrderPlugin(),
        // new webpack.optimize.UglifyJsPlugin({minimize: true})
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            mangle:    true,
            compress:  {
                drop_console: true
            },
            output: {
                comments: false
            }
        })
    );

	plugins.push(
		// Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
		new ExtractTextPlugin('assets/css/[name].[contenthash:8].css')
	)

	loaders.push(
		{
			test: /\.scss$/,
			// "?-autoprefixer" disables autoprefixer in css-loader itself:
			// https://github.com/webpack/css-loader/issues/281
			// We already have it thanks to postcss. We only pass this flag in
			// production because "css" loader only enables autoprefixer-powered
			// removal of unnecessary prefixes when Uglify plugin is enabled.
			// Webpack 1.x uses Uglify plugin as a signal to minify *all* the assets
			// including CSS. This is confusing and will be removed in Webpack 2:
			// https://github.com/webpack/webpack/issues/283
			loader:
			//ExtractTextPlugin.extract('style', 'css?importLoaders=1&-autoprefixer!postcss')
			ExtractTextPlugin.extract({
				fallback: 'style-loader',
				// use: ['css-loader', 'sass-loader']
				use: [ 
				{ 
					loader: 'css-loader', 
					options: { importLoaders: 1, modules: true }
				},
					{ 
					loader: 'postcss-loader',
					options: {
						plugins: [autoprefixer()]
					}
				},
					{ 
					loader: 'sass-loader'
				}
				]
			})
			// Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
		}
	)

	// outputPath = path.join(__dirname, '/build/assets/js/');
	outputPath = paths.outputProdPath;

	filename = 'assets/js/bundle.min.js';

	devTool = false;
	// 'hidden-source-map';

	// devTool = 'inline-source-map';
	console.log('\n ---- WEBPACK ----\n \n running in production \n');

} else {

	loaders.push(
		{
			test: /\.scss$/,
			loaders: [
				'style-loader',
				'css-loader?importLoaders=1',
				'sass-loader'
			]
		}
	)
	console.log('\n ---- WEBPACK ---- \n \n running in development \n');

}

console.log(path.join(' running webpack in ', __dirname));
console.log(' filename: ' + filename);
console.log(' devTool: ' + devTool);
console.log(' outputPath path ' + outputPath + '\n');

var entryPoints = paths.appEntryPoint;

plugins.push(new webpack.DefinePlugin({
	ENV : JSON.stringify(env)
}));

plugins.push(
	new HtmlWebpackPlugin({
		inject: false,
		PROD: PROD,
		template: paths.appHtml,
		filename: 'index.html',
		hash: true
	})
);

module.exports = {

    /*
    http://webpack.github.io/docs/configuration.html
	ENTRY
	If you pass a string: The string is resolved to a module which is loaded upon startup.
	If you pass an array: All modules are loaded upon startup. The last one is exported.
	If you pass an object: Multiple entry bundles are created. The key is the chunk name. The value can be a string or an array.
	*/
	node: {
		fs: 'empty'
	},

	entry: entryPoints,

	// if multiple outputs, use [name] and it will use the name of the entry point, and loop through them
	output: {
		path: outputPath,
		filename: filename,
		publicPath: '/'
	},

	plugins: plugins,

	// make 'zepto' resolve to your local copy of the library
	// i. e. through the resolve.alias option
	// will be included in the bundle, no need to add and load vendor
	resolve: {
		alias: {
		},
		modules: [
			'src/css/',
			'src/scripts/app/',
			'src/scripts/vendors/',
			'shared/',
			'public/assets/',
			'node_modules'
		]
	},

	module: {
		rules: loaders
		// loaders: loaders
	},

	stats: {
		// Nice colored output
		colors: true
	},

	// Create Sourcemaps for the bundle
	devtool: devTool

};