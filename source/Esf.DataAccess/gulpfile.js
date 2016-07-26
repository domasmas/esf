/// <binding AfterBuild='tscompile' />
/*
This file in the main entry point for defining Gulp tasks and using Gulp plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkId=518007
*/

var gulp = require("gulp");
var ts = require("gulp-typescript");
var tsProject = ts.createProject('tsconfig.json');

gulp.task('tscompile', function () {
    var tsResult = gulp.src('Upgrade/**/*.ts')
    .pipe(ts(tsProject));
    tsResult.js.pipe(gulp.dest('UpgradeOutput'))
});