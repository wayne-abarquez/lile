'use strict';

var gulp = require('gulp');
var paths = gulp.paths;
var $ = require('gulp-load-plugins')();

gulp.task('sass', function () {
    return gulp.src(paths.srcSass + 'app.scss')
        .pipe($.sass({style: 'expanded'}))
        .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']}))
        .on('error', function handleError(err) {
            console.error(err.toString());
            this.emit('end');
        })
        .pipe($.csso())
        .pipe($.rename('app.min.css'))
        .pipe(gulp.dest(paths.destCss));
});

gulp.task('vendor-css', function () {
   return gulp.src([
       paths.bower + 'angular-material/angular-material.min.css',
       paths.bower + 'sweetalert/dist/sweetalert.css',
       paths.bower + 'angular-treasure-overlay-spinner/dist/treasure-overlay-spinner.min.css'
   ])
       .pipe($.concatCss('vendor.min.css'))
       .pipe($.csso())
       .pipe(gulp.dest(paths.destCss));
});

gulp.task('styles', ['sass', 'vendor-css']);
