import gulp          from 'gulp';
import plugins       from 'gulp-load-plugins';
import path          from 'path';
import del           from 'del';
import runSequence   from 'run-sequence';
import webpack       from 'webpack-stream';
import named         from 'vinyl-named';
import pkg           from './package';
import webpackConfig from './webpack.config';

const $          = plugins();
const production = !!$.util.env.production;
const copyFiles  = [
  './source/**/*',
  '!./source/js/**/*'
];

gulp.task('default', cb => {
  runSequence('clean', 'scripts', 'copy', cb);
});

gulp.task('scripts', cb => {
  runSequence('scripts:main', cb);
});

gulp.task('scripts:main', () => {
  return gulp.src('./source/js/main.jsx')
    .pipe(named())
    .pipe(webpack(webpackConfig))
    .pipe($.size({ title: 'Main bundle' }))
    .pipe(gulp.dest('build/js'));
});

gulp.task('copy', () => gulp.src(copyFiles).pipe(gulp.dest('build')));

gulp.task('clean', () => del('build'));
