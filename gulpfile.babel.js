import gulp from 'gulp';
import babel from 'gulp-babel';

let src = './src/**/*';

gulp.task('default', ['build']);

gulp.task('watch', () => gulp.watch(src, ['build']));

gulp.task('build', () =>
	gulp.src(src)
		.pipe(babel())
		.pipe(gulp.dest('./lib'))
);
