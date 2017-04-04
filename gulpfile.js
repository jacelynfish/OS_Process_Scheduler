/**
 * Created by jacelynfish on 2017/4/2.
 */
var gulp = require('gulp');
var gulpBabel = require('gulp-babel');

gulp.task('babel', function(){
    return gulp.src(['psjfScheduler.js','PubSub.js'])
        .pipe(gulpBabel())
        .pipe(gulp.dest('dist'));
})