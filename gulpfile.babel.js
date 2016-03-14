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

// Uglify JS built JS files:
// Webpack has an uglifier plugin, but it's a lot slower than using gulp-uglify for some reason.
// This task is tricky in that it modifies stuff that's already in the build folder. It runs no
// matter what, but it only actually minifies code if --production is passed to gulp.
gulp.task('scripts:uglify', () => {
  return gulp.src('./build/js/**/*.js')
    .pipe($.if(production, $.uglify()))
    .pipe($.size({ title: 'JS', showFiles: true }))
    .pipe(gulp.dest('./build/js'));
});

// Compile global Sass styles:
// We're also using Webpack's sass-loader. Why do we have two things that compile Sass?
// + Use Webpack and sass-loader for component-specific styles. Component stylesheets go in `source/assets/css`.
// + Use gulp-sass for global page styles that are used regardless of which components are on the page. Global styles go in `source/css`.
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
    .pipe($.size({ title: 'CSS', showFiles: true }))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream());
});

// This just copies matching files from source to build unchanged
gulp.task('copy', () => gulp.src(copyFiles).pipe(gulp.dest('build')));

// Recursively delete build folder
gulp.task('clean', () => del('build'));

// Spawn a browser-sync server with live reload and synchronized scrolling
gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: './build'
    }
  });

  gulp.watch('./source/assets/js/**/*.{js,jsx,scss}', () => {
    runSequence('scripts', browserSync.reload);
  });

  gulp.watch('./source/css/**/*.scss', [ 'styles' ]);

  gulp.watch(copyFiles, () => {
    runSequence('copy', browserSync.reload);
  });
});
