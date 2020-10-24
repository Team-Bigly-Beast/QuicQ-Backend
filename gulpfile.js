const gulp = require('gulp');

function buildClient(cb) {
    return gulp.src('src/www/**')
        .pipe(gulp.dest('build/www/'));
}

function buildServer(cb) {
    return gulp.src('src/*.js')
        .pipe(gulp.dest('build/'));
}

exports.default = gulp.parallel(buildServer, buildClient);