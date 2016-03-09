import gulp          from 'gulp';
import plugins       from 'gulp-load-plugins';
import path          from 'path';
import runSequence   from 'run-sequence';
import webpack       from 'webpack-stream';
import pkg           from './package';
import webpackConfig from './webpack.config';

const $          = plugins();
const production = !!$.util.env.production;

gulp.task('default', [ 'scripts' ]);

gulp.task('scripts', cb => {
  runSequence('scripts:main', cb);
});

gulp.task('scripts:main', () => {
  return gulp.src('./source/js/main.jsx')
    .pipe(webpack(webpackConfig))
    .pipe($.size({ title: 'Main bundle' }))
    .pipe(gulp.dest('build/js'));
});
