'use strict';

var gulp = require('gulp'),
    args = require('yargs').argv
;

var paths = gulp.paths;
var $ = require('gulp-load-plugins')();

gulp.task('vendor-scripts', function () {
    return gulp.src([
        paths.bower + 'jquery/dist/jquery.min.js',
        paths.bower + 'underscore/underscore-min.js',
        paths.bower + 'angular/angular.min.js',
        paths.bower + 'angular-animate/angular-animate.min.js',
        paths.bower + 'angular-aria/angular-aria.min.js',
        paths.bower + 'angular-cookies/angular-cookies.min.js',
        paths.bower + 'angular-material/angular-material.js',
        paths.bower + 'sweetalert/dist/sweetalert.min.js',
        paths.bower + 'ngSweetAlert/SweetAlert.min.js',
        paths.bower + 'angular-treasure-overlay-spinner/dist/treasure-overlay-spinner.min.js',
        paths.bower + 'v-accordion/dist/v-accordion.min.js'
    ])
        .pipe($.plumber())
        .pipe($.concat('vendor.min.js'))
        .pipe($.if(args.production, $.uglify({mangle: false})))
        .pipe(gulp.dest(paths.destJs))
        .pipe($.size());
});

gulp.task('jq-scripts', function () {
   return gulp.src(paths.srcJs + 'app_jq.js')
       .pipe($.plumber())
       .pipe($.eslint())
       .pipe($.eslint.format())
       .pipe($.concat('app-jq.min.js'))
       .pipe($.if(args.production, $.uglify()))
       .pipe($.if(args.production, $.jsObfuscator()))
       .pipe(gulp.dest(paths.destJs))
       .pipe($.size());
});

gulp.task('app-scripts', ['jq-scripts'], function () {
    return gulp.src([
        '!' + paths.srcJs + 'app_jq.js',
        paths.srcJs + 'app/*.js',
        paths.srcJs + 'app/**/*.js'
    ])
        .pipe($.plumber())
        .pipe($.eslint())
        .pipe($.eslint.format())
        .pipe($.ngAnnotate())
        .pipe($.angularFilesort())
        .pipe($.concat('app.min.js'))
        .pipe($.if(args.production, $.uglify()))
        .pipe($.if(args.production, $.jsObfuscator()))
        .pipe(gulp.dest(paths.destJs))
        .pipe($.size());
});

gulp.task('scripts', ['vendor-scripts', 'app-scripts']);
