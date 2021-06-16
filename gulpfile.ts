const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

function buildClient(cb) {
    return gulp.src('src/www/**')
        .pipe(gulp.dest('build/www/'));
}

function buildServer(cb) {
    const buildDir = "build/";
    gulp.src("./src/*.ts")
        .pipe(tsProject())
        .js.pipe(gulp.dest(buildDir));
    cb();
}

exports.default = gulp.parallel(buildServer, buildClient);