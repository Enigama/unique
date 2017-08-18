var gulp = require('gulp'),
    less = require('gulp-less'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer')


//*************************ОЧИСТКА КЕША КАРТИНОК*************************************
gulp.task('clear', function() {
    return cache.clearAll();
});
//*********************МИНИФИКАЦИЯ КАРТИНОК******************************************
gulp.task('img', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            une: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});
//**********************************************************************************
gulp.task('clean', function() {
    return del.sync('dist');
});
//**********************************************************************************
gulp.task('css-libs', ['less'], function() {
    return gulp.src('app/css/libs.css')
        .pipe(cssnano())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('app/css'));
});
//**********************************************************************************
gulp.task('scripts', function() {
    return gulp.src([
            'app/libs/jquery/dist/jquery.min.js',
            'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
        ])
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('app/js'));

});
//**********************************************************************************


gulp.task('browser-sync', function() {
    browserSync({
        server: "./app",
        open: true
            /*{
            				baseDir:'app'

            			},open:true//, notify:false для отключения уведомления*/
    });
});
//**********************LESS********************************************************
gulp.task('less', function() {
    return gulp.src('app/less/main.less')
        .pipe(less())
        .pipe(autoprefixer(['last 15 versions', '>1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({ stream: true }))
});
//**********************************************************************************
gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
    gulp.watch('app/less/*.less', ['less']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});
//**********************************************************************************
gulp.task('build', ['clean', 'img', 'less', 'scripts'], function() {
    var buildCss = gulp.src([
            'app/css/main.css',
            'app/css/libs.min.css'
        ])
        .pipe(gulp.dest('dist/css'));

    var buildFonts = gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));

    var buildJs = gulp.src('app/js/**/*')
        .pipe(gulp.dest('dist/js'));

    var buildHtml = gulp.src('app/*.html')
        .pipe(gulp.dest('dist'));
});

//******************************************
gulp.task('mytask', function() {
    console.log('test task! WORK');

});
//******************************************