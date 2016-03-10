import webpack     from 'webpack';
import gutil       from 'gulp-util';
import path        from 'path';
import uglifyConf  from './uglify-config';
import ProgressBar from 'progress';

const production = !!gutil.env.production;

let progress = new ProgressBar('[:bar] :percent', { total: 100 });

let progressPlugin = new webpack.ProgressPlugin((percent, msg) => {
  progress.update(percent);
});

let commonsChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: Infinity
});

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
    ]
  },
  entry: {
    home: './source/js/home',
    page2: './source/js/page2',
    vendor: [
      'lodash',
      'react',
      'react-dom'
    ]
  },
  output: {
    path: path.join(__dirname, 'build', 'js'),
    filename: '[name].js'
  },
  module: {
    loaders: [
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
      {
        test: /\.scss$/,
        loaders: [ 'style', 'css', 'sass' ]
      }
    ]
  },
  plugins: [
    bannerPlugin,
    progressPlugin,
    commonsChunkPlugin
  ]
};

production && webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin(uglifyConf));

export default webpackConfig;
