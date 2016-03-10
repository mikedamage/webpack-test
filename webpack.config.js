import webpack     from 'webpack';
import gutil       from 'gulp-util';
import path        from 'path';
import uglifyConf  from './uglify-config';
import ProgressBar from 'progress';

const production = !!gutil.env.production;

let progress = new ProgressBar('[:bar] :percent', { total: 100 });

const webpackConfig = {
  resolve: {
    root: path.join(__dirname, 'source/js'),
    extensions: [
      '',
      '.webpack.js',
      '.web.js',
      '.js',
      '.jsx'
    ]
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
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin('Copyright (C) 2016, ePublishing, Inc.'),
    new webpack.ProgressPlugin((percent, msg) => {
      progress.update(percent);
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'main-commons',
      chunks: [ 'main' ]
    })
  ]
};

if (production) {
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin(uglifyConf));
  webpackConfig.plugins.push(new webpack.optimize.DedupePlugin());
}

export default webpackConfig;
