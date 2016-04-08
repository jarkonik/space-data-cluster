'use strict';

const gulp = require('gulp');
const webpackStream = require('webpack-stream');
const WebpackDevServer = require('webpack-dev-server');
const gutil = require('gulp-util');
const webpack = require('webpack');
const webpackConfig = require('./client/config.js');
const nodemon = require('gulp-nodemon');
const shell = require('gulp-shell')

gulp.task('webpack-build', () => {
  const stream = gulp.src('./client/js/main.js')
    .pipe(webpackStream(require('./client/config.js')))
    .pipe(gulp.dest('./public'));
  return stream;
});

gulp.task('backend-dev', () => {
  nodemon({
    script: 'server/main.js',
    ext: 'js html',
    watch: 'server',
  });
});

gulp.task('electron-dev', shell.task(['electron electron/main.js']));

gulp.task('webpack-dev', () => {
  const compiler = webpack(webpackConfig);
  const serverOptions = {
    proxy: { '*': 'http://localhost:8080' },
    stats: { colors: true },
  };

  new WebpackDevServer(compiler, serverOptions).listen(3000, 'localhost', (err) => {
    if (err) throw new gutil.PluginError('webpack-dev-server', err);
    gutil.log('[webpack-dev-server]', 'http://localhost:3000');
  });
});

gulp.task('dev', ['backend-dev', 'webpack-dev', 'electron-dev']);
