import _                from 'lodash';
import gulp             from 'gulp';
import plugins          from 'gulp-load-plugins';
import path             from 'path';
import del              from 'del';
import runSequence      from 'run-sequence';
import webpack          from 'webpack';
import browserSync      from 'browser-sync';
import pkg              from './package';
import webpackConfig    from './webpack.config';

const $          = plugins();
const production = !!$.util.env.production;
const copyFiles  = [
  './source/**/*',
  '!./source/assets',
  '!./source/assets/**/*',
  '!./source/css/**/*'
];

gulp.task('default', cb => {
  runSequence('clean', 'scripts', [ 'styles', 'copy' ], cb);
});

gulp.task('scripts', cb => {
  runSequence('scripts:webpack', 'scripts:uglify', cb);
})

gulp.task('scripts:webpack', cb => {
  webpack(webpackConfig, (err, stats) => {
    if (err) throw new $.util.PluginError('webpack', err);
    $.util.log(stats.toString({
      colors: true,
      children: false,
      chunkModules: false
    }));
    cb();
  });
});

// Webpack has an uglifier plugin, but it's a lot slower than using gulp-uglify for some reason.
// This task is tricky in that it modifies stuff that's already in the build folder. It runs no
// matter what, but it only actually minifies code if --production is passed to gulp.
gulp.task('scripts:uglify', () => {
  return gulp.src('./build/js/**/*.js')
    .pipe($.if(production, $.uglify()))
    .pipe($.size({ title: 'JS' }))
    .pipe(gulp.dest('./build/js'));
})

gulp.task('styles', () => {
  return gulp.src('./source/css/**/*.scss')
    .pipe($.sass({
      precision: 10,
      outputStyle: production ? 'compressed' : 'expanded',
      includePaths: [
        path.join(__dirname, 'source', 'css'),
        path.join(__dirname, 'node_modules')
      ]
    }))
    .pipe($.if(production, $.pleeease()))
    .pipe(gulp.dest('./build/css'));
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
