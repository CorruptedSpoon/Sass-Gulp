const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const eslint = require('gulp-eslint-new');
const webpack = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const nodemon = require ('gulp-nodemon');

const sassTask = (done) => {
    gulp.src('./scss/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./hosted'));
    done();
};

const lintTask = (done) => {
    gulp.src('./server/**/*.js')
        .pipe(eslint({
            fix: true
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());

    done();
};

const jsTask = (done) => {
    webpack(webpackConfig)
        .pipe(gulp.dest('./hosted'));
    
    done();
};

const watch = (done) => {
    gulp.watch('./scss', sassTask);
    gulp.watch('./server', lintTask);
    gulp.watch(['./client/**/*.js', './client/**/*.jsx'], jsTask);
    nodemon({
        script: './server/app.js',
        tasks: ['lintTask'],
        watch: ['./server'],
        done: done
    });
};

module.exports = {
    build: gulp.parallel(sassTask, lintTask, jsTask),
    sassTask,
    lintTask,
    jsTask,
    watch
}