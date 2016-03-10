import _             from 'lodash';
import gulp          from 'gulp';
import plugins       from 'gulp-load-plugins';
import path          from 'path';
import del           from 'del';
import runSequence   from 'run-sequence';
import webpack       from 'webpack';
import named         from 'vinyl-named';
import browserSync   from 'browser-sync';
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
});

gulp.task('copy', () => gulp.src(copyFiles).pipe(gulp.dest('build')));

gulp.task('clean', () => del('build'));

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: './build'
    }
  });

  gulp.watch('./source/js/**/*.{js,jsx}', () => {
    runSequence('scripts', browserSync.reload);
  });

  gulp.watch(copyFiles, () => {
    runSequence('copy', browserSync.reload);
  });
});
