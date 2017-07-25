var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var size = require('gulp-size');
var notify = require('gulp-notify');
//CSS
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var cssmin = require('gulp-cssmin');
var browserSync = require('browser-sync');
var cleanCSS = require('gulp-clean-css');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var size = require('gulp-size');
var notify = require('gulp-notify');

var watch = require('gulp-watch');

var browserSync = require('browser-sync');
var connect = require('gulp-connect-php');


var handleError = function(err) {
    console.log(err);
    this.emit('end');
}


//============================================
//JS tasks
//============================================    
    // Concatenate JS
    gulp.task('js:dev', function() {
        var s = size();
        return gulp.src('src/js/*.js')
            .pipe(plumber({ //dodaje obs�ug� b��d�w
                errorHandler: handleError
            }))
            .pipe(sourcemaps.init()) //odpalam generowanie sourcemapy
            .pipe(concat('scripts.js')) //�acz� pliki
            .pipe(s) //pobieram rozmiar plik�w w stramie
            .pipe(rename({suffix: '.min'})) //zmieniam nazw�
            .pipe(sourcemaps.write('.')) //tworz� sourcemap�
            .pipe(gulp.dest('dist/js')) //wszystko zapisuj� w dist/js
            .pipe(browserSync.stream()) //odpalam browserSync
            .pipe(notify({ //i wypisuj� komunikat
                onLast: true,
                message: function () {
                    return 'Total JS size ' + s.prettySize;
                }
            }))
    });

    // Minify JS
    gulp.task('js:prod', function() {
        var s = size();
        return gulp.src('src/js/*.js')
            .pipe(plumber({ //dodaje obs�ug� b��d�w
                errorHandler: handleError
            }))
            .pipe(sourcemaps.init())
            .pipe(concat('scripts.js'))
            .pipe(uglify())
            .pipe(s)
            .pipe(rename({suffix: '.min'}))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist/js'))
            .pipe(browserSync.stream())
            .pipe(notify({
                onLast: true,
                message: function () {
                    return 'Total JS size ' + s.prettySize;
                }
            }))
    });

    // Lint Task
    gulp.task('js-lint', function() {
        return gulp.src('src/js/*.js')
            .pipe(plumber({
                errorHandler: handleError
            }))
            .pipe(jshint())
            .pipe(jshint.reporter('default'));
    });
	//============================================
//Sass tasks
//============================================
    gulp.task('sass:prod', function() {
        var s = size();
        return gulp.src('src/scss/style.scss')
            .pipe(plumber({
                errorHandler: handleError
            }))
            .pipe(sourcemaps.init())
            .pipe(
                sass({
                    outputStyle : 'compressed'
                })
            )
            .pipe(autoprefixer({browsers: ["> 1%"]}))
            .pipe(cleanCSS())
            .pipe(s)
            .pipe(rename({suffix: '.min'}))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist/css'))
            .pipe(browserSync.stream({match: '**/*.css'}))
            .pipe(notify({
                onLast: true,
                message: function () {
                    return 'Total CSS size: ' + s.prettySize;
                }
            }))
    });

    gulp.task('sass:dev', function() {
        var s = size();
        return gulp.src('src/scss/style.scss')
            .pipe(plumber({
                errorHandler: handleError
            }))
            .pipe(sourcemaps.init())
            .pipe(
                sass({
                    outputStyle : 'expanded'
                })
            )
            .pipe(autoprefixer({browsers: ["> 1%"]}))
            .pipe(rename({suffix: '.min'}))
            .pipe(s)
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest('dist/css'))
            .pipe(browserSync.stream({match: '**/*.css'}))
            .pipe(notify({
                onLast: true,
                message: function () {
                    return 'Total CSS size ' + s.prettySize;
                }
            }))
    });
	//============================================
//Watch tasks
//============================================
    gulp.task('watch:prod', function() {
        gulp.watch('src/js/*.js', ['js-lint', 'js:prod']);
        gulp.watch('src/scss/**/*.scss', ['sass:prod']);
    });

    gulp.task('watch:dev', function() {
        gulp.watch('src/js/*.js', ['js-lint', 'js:dev']);
        gulp.watch('src/scss/**/*.scss', ['sass:dev']);
    });
	//============================================
//Server tasks
//============================================    
    //php server
    gulp.task('browser-sync-php', function() {
        connect.server({
            base : './dist'
        }, function() {
            browserSync({
                proxy: '127.0.0.1:8000',
                notify: false            
            });
        });

        gulp.watch('**/*.php').on('change', function () {
            browserSync.reload();
        });
    });
	//============================================
//Global tasks
//============================================
    gulp.task('compile:dev', function() {
        console.log(color('-------------------------------------------', 'YELLOW'));
        console.log(color('Kompiluj� scss i ��cz� js', 'YELLOW'));
        console.log(color('-------------------------------------------', 'YELLOW'));
        gulp.start('sass:dev', 'js-lint', 'js:dev');
    });

    gulp.task('compile:prod', function() {
        console.log(color('-------------------------------------------', 'YELLOW'));
        console.log(color('Kompiluj� scss i js', 'YELLOW'));
        console.log(color('-------------------------------------------', 'YELLOW'));
        gulp.start('sass:prod', 'js-lint', 'js:prod');
    });

    gulp.task('dev', function() {
        gulp.start('sass:dev', 'js-lint', 'js:dev', 'watch:dev', 'browser-sync-php');
        console.log(color('-------------------------------------------', 'YELLOW'));
        console.log(color('Rozpoczynamy prac� milordzie (DEV)', 'YELLOW'));
        console.log(color('-------------------------------------------', 'YELLOW'));
    });

    gulp.task('prod', function() {
        gulp.start('sass:prod', 'js-lint', 'js:prod', 'watch:prod', 'browser-sync-php');
        console.log(color('-------------------------------------------', 'YELLOW'));
        console.log(color('Rozpoczynamy prac� milordzie (PROD)', 'YELLOW'));
        console.log(color('-------------------------------------------', 'YELLOW'));
    });

    gulp.task('default', ['dev']);