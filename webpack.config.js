/**
 * Webpack Test Project
 * Webpack Configuration Module
 *
 * https://webpack.github.io/docs/configuration.html
 */

import webpack     from 'webpack';
import gutil       from 'gulp-util';
import path        from 'path';
import uglifyConf  from './uglify-config';
import ProgressBar from 'progress';

// This will be true if --production is passed to gulp, false otherwise
const production   = !!gutil.env.production;

const node_modules = path.join(__dirname, 'node_modules');

// Create a progress bar to display build status.
let progress = new ProgressBar('[:bar] :percent', { total: 100 });

// Update the progress bar using Webpack's progress plugin
let progressPlugin = new webpack.ProgressPlugin((percent, msg) => {
  progress.update(percent);
});

// Create a vendor scripts bundle for common libraries using the
// CommonsChunkPlugin.
//
// https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
let commonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: Infinity
});

// Add copyright message to output files
let bannerPlugin = new webpack.BannerPlugin('Copyright (C) 2016 ePublishing, Inc.');

let webpackConfig = {
  resolve: {
    root: path.join(__dirname, 'source', 'js'),
    extensions: [
      '',
      '.webpack.js',
      '.web.js',
      '.js',
      '.jsx'
    ],
    alias: {}
  },
  entry: {
    // Each output target needs an entry here that points Webpack to
    // a source script.
    home: './source/js/home',
    page2: './source/js/page2',
    vendor: [
      'lodash',
      'react',
      'react-dom'
    ]
  },
  output: {
    path: path.join(__dirname, 'build', 'js'), // Output directory where compiled chunks will be saved
    filename: '[name].js' // Placeholders usable here include [name] and [hash]
  },
  module: {
    loaders: [
      // Load all JS files via Babel, compile ES2015 and React JSX to ES5
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
        query: {
          presets: [
            'react',
            'es2015'
          ]
        }
      },

      // Compile sass files into JS modules. This allows React components
      // to bundle their own stylesheets and load them via ES2015 imports.
      {
        test: /\.scss$/,
        loaders: [ 'style', 'css', 'sass' ]
      }
    ]
  },
  plugins: [
    bannerPlugin,      // Add copyright comment to the top of each output file
    progressPlugin,    // Show a custom progress bar during build
    commonsChunkPlugin // Create a vendor.js file with commonly used libraries instead of bundling them into each entry
  ]
};

if (production) {
  // Minify output files. This adds several seconds to overall build time and results in much smaller files.
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin(uglifyConf));
}

export default webpackConfig;
