/// <binding AfterBuild='after-build' ProjectOpened='project-open' />

var gulp = require('gulp');
var tsc = require('gulp-typescript');
var tscConfig = require('./tsconfig.json');
var sourcemaps = require('gulp-sourcemaps');
var systemjsBuilder = require('systemjs-builder');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var cleanCSS = require('gulp-clean-css');
var gulpConcatCss = require('gulp-concat-css');
var merge = require('merge-stream');var karmaServer = require('karma').Server;
var WWW_ROOT = './wwwroot';
var APP_DESTINATION = WWW_ROOT + '/app';
var CONTENT_DESTINATION = WWW_ROOT + '/content';
var LIBRARIES_DESTINATION = WWW_ROOT + '/lib';
var END_TO_END_TESTS_DESTINATION = WWW_ROOT + '/endToEndTests';

var RELEASE_JS_DESTINATION = WWW_ROOT + '/release/js';
var RELEASE_CSS_DESTINATION = WWW_ROOT + '/release/css';

var protractor = require('gulp-protractor').protractor;

gulp.task('clean:app',
    function() {
        return gulp.src(APP_DESTINATION, { read: false })
            .pipe(clean({ force: true }));
    });

gulp.task('clean:vendor',
    function () {
        return gulp.src(LIBRARIES_DESTINATION, { read: false })
            .pipe(clean({ force: true }));
    });

gulp.task('clean:content',
    function () {
        return gulp.src(CONTENT_DESTINATION, { read: false })
            .pipe(clean({ force: true }));
    });

gulp.task('compile:tsApp',
    function () {
        var sourceAppTsFiles = [
            './App/**/*.ts',
            './node_modules/@angular/**/*.d.ts',
            './node_modules/@types/**/*.d.ts'
        ];

        var tsProject = tsc.createProject('tsconfig.json', { typescript: require('typescript') });
        var tsResult = gulp
            .src(sourceAppTsFiles)
            .pipe(sourcemaps.init())
            .pipe(tsProject())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(APP_DESTINATION));
        return tsResult;
    });

gulp.task('compile:tsEndToEndTests',
    function() {
        var sourceEndToEndTsFiles = [
            './endToEndTests/**/*.ts',
            './node_modules/@types/**/*.d.ts'
        ];
        var tsProject = tsc.createProject('tsconfig.json', { typescript: require('typescript') });
        var tsEndToEndResult = gulp
            .src(sourceEndToEndTsFiles)
            .pipe(sourcemaps.init())
            .pipe(tsProject())
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(END_TO_END_TESTS_DESTINATION));

        return tsEndToEndResult;
    });
gulp.task('compile:ts', ['compile:tsApp', 'compile:tsEndToEndTests']);

gulp.task('copy:vendor', function () {
    return gulp.src([
            'node_modules/rxjs/**/*',
            'node_modules/observable/*',
            'node_modules/reflect-metadata/Reflect.js',
            'node_modules/@angular/**/*',
            'node_modules/bootstrap-less/js/*.js'
        ])
        .pipe(gulp.dest(LIBRARIES_DESTINATION));
});

gulp.task('bundle:vendor', function () {
    return gulp.src([
        'node_modules/zone.js/dist/zone.js',
        'node_modules/reflect-metadata/Reflect.js',
        'node_modules/systemjs/dist/system-polyfills.js',
        'node_modules/core-js/client/shim.min.js',
        'node_modules/systemjs/dist/system.js',
        'systemjs.config.js'
    ])
        .pipe(concat('vendors.js'))
        .pipe(gulp.dest(LIBRARIES_DESTINATION));
});

gulp.task('bundle:app', ['compile:ts'], function () {
    var builder = new systemjsBuilder('/', './systemjs.config.js');
    return builder.buildStatic('app', APP_DESTINATION + '/app.js');
});

gulp.task('compile:less',
    function() {
        return gulp.src([
                './App/**/*.less'
            ])
            .pipe(less({
                paths: [
                    '.',
                    './node_modules/bootstrap-less'
                ]
            }))
            .pipe(gulpConcatCss('styles.css'))
            .pipe(gulp.dest(CONTENT_DESTINATION));
    });

gulp.task('bundle', function () {
    return gulp.src([
        LIBRARIES_DESTINATION + '/vendors.js',
        APP_DESTINATION + '/app.js'
    ])
    .pipe(concat('app.bundle.js'))
    .pipe(uglify())
    .pipe(gulp.dest(APP_DESTINATION));
});

gulp.task('build', function(callback) {
    runSequence(
            ['clean:app', 'clean:vendor', 'clean:content'],
            ['compile:ts', 'copy:vendor', 'compile:less'],
            ['bundle:vendor', 'bundle:app'],
            callback
        );
});

gulp.task('build-dev', function (callback) {
    runSequence(
        ['compile:ts', 'compile:less'],
        callback);
});

gulp.task('release:js', ['bundle'],
    function () {
        gulp.src(APP_DESTINATION + '/app.bundle.js')
            .pipe(gulp.dest(RELEASE_JS_DESTINATION));
    });

gulp.task('release:css',
    function () {
        gulp.src(CONTENT_DESTINATION + '/styles.css')
            .pipe(cleanCSS())
            .pipe(gulp.dest(RELEASE_CSS_DESTINATION));
    });

gulp.task('release', ['release:js', 'release:css']);

gulp.task('watch:less',
    function() {
        gulp.watch('./App/**/*.less', ['compile:less']);
    });

gulp.task('module-changed',
    function(callback) {
        runSequence(
            ['clean:app', 'clean:vendor'],
            'copy:vendor',
            ['compile:ts', 'compile:less'],
            callback
        );
    });

gulp.task('watch:modules',
    function () {
        gulp.watch('./node_modules/**/*', ['module-changed']);
    });

gulp.task('watch:ts',
    function () {
        gulp.watch(['./App/**/*.ts', './App/*.ts', './endToEndTests/**/*.ts'], ['compile:ts']);
    });

gulp.task('watch', ['watch:less', 'watch:ts']);

gulp.task('before-build',
    function(callback) {
        runSequence(
            []
        );
    });

gulp.task('after-build',
    function (callback) {
        runSequence(
            ['compile:less', 'compile:ts'],
            callback
        );
    });

gulp.task('project-open',
    function (callback) {
        runSequence(
            ['compile:less', 'compile:ts'],
            'watch',
            callback
        );
    });

gulp.task('project-clean',
    function (callback) {
        runSequence(
            [],
            callback
        );
    });

gulp.task('tests-run-tdd', function (done) {
    new karmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: false
    }, done).start();
});

gulp.task('e2etests:run', function () {
    gulp.src([END_TO_END_TESTS_DESTINATION + '/**/*.spec.js'])
    .pipe(protractor({
        configFile: "protractor.config.js",
        args: ['--baseUrl', 'http://localhost:4444']
    }))
    .on('error', function (e) {
        console.dir(e);
        throw e;
    });
});
gulp.task('e2etests:debugRun', function () {
    gulp.src([END_TO_END_TESTS_DESTINATION + '/**/*.spec.js'])
    .pipe(protractor({
        configFile: "protractor.config.js",
        args: ['--baseUrl', 'http://localhost:4444'],
        debug: true
    }))
    .on('error', function (e) {
        console.dir(e);
        throw e;
    });
});
var webdriver_standalone = require("gulp-protractor").webdriver_standalone;
gulp.task('e2etests:startWebDriver', webdriver_standalone);

gulp.task('e2etests:startServerAndRunTests', ['e2etests:startWebDriver', 'e2etests:run']);

gulp.task('default', ['build']);