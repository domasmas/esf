/// <binding AfterBuild='generateUpgradeScripts' Clean='cleanOutput' />

var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var concat = require('gulp-concat');
var clean = require('gulp-clean');

gulp.task('cleanOutput', function () {
    gulp.src('UpgradeOutput', { read: false })
    .pipe(clean({ force: true }));
});

gulp.task('tsCompile', function () {
    var tsResult = gulp.src('Upgrade/**/*.ts')
    .pipe(ts(tsProject));
    tsResult.js.pipe(gulp.dest('UpgradeOutput'));
});

gulp.task('bundleUpgrade', ['tsCompile'], function () {
    gulp.src([
        'UpgradeOutput/Framework/upgradeFramework.js',
        'UpgradeOutput/Scripts/*.js'])
    .pipe(concat('upgradeScripts.js'))
    .pipe(gulp.dest('UpgradeOutput'));
})

gulp.task('generateUpgradeScripts', ['bundleUpgrade']);