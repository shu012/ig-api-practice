var gulp        = require('gulp');
var browserify = require('gulp-browserify');
var browserSync = require('browser-sync').create();
var gutil       = require('gulp-util');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');

var gulp_src = gulp.src;
gulp.src = function() {
  return gulp_src.apply(gulp, arguments)
    .pipe(plumber(function(error) {
      // Output an error message
      gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
      // emit the end event, to properly end the task
      this.emit('end');
    })
  );
};

gulp.task('default', ['serve', 'build-js', 'watch'], function () {
	console.log('Watching files...');
});

// Static server
gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: "./public"
        }
    });

    gulp.watch("./public/**/*.*", browserSync.reload);
});

gulp.task('watch', () => {
  	gulp.watch('src/index.js', ['build-js', 'serve']);
  	gulp.watch('public/index.html', ['serve']);
});

gulp.task('build-js', function() {
	// Single entry point to browserify 
	gulp.src('src/index.js')
		.pipe(browserify({
		  insertGlobals : true
		}))
		.pipe(gulp.dest('./public/'))
});
