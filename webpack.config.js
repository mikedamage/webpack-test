import path from 'path';

const webpackConfig = {
  watch: true,
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
  }
};

export default webpackConfig;
