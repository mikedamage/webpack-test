import gulp          from 'gulp';
import plugins       from 'gulp-load-plugins';
import path          from 'path';
import del           from 'del';
import runSequence   from 'run-sequence';
import webpack       from 'webpack-stream';
import pkg           from './package';
import webpackConfig from './webpack.config';

const $          = plugins();
const production = !!$.util.env.production;

gulp.task('default', cb => {
  runSequence('clean', 'scripts', cb);
});

gulp.task('scripts', cb => {
  runSequence('scripts:main', cb);
});

gulp.task('scripts:main', () => {
  return gulp.src('./source/js/main.jsx')
    .pipe(webpack(webpackConfig))
    .pipe($.size({ title: 'Main bundle' }))
    .pipe(gulp.dest('build/js'));
});

gulp.task('clean', () => del('build'));
