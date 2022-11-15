let gulp, 
	{
		src, 
		dest, 
		task, 
		watch,
		series
	} = require('gulp');

let gulpSass	= require('gulp-sass');
let nodeSass	= require('node-sass');
let sass		= gulpSass(nodeSass);
let prefixer	= require('gulp-autoprefixer');

let include		= require('gulp-file-include');

let source		= require('vinyl-source-stream');
let babelify	= require('babelify');
let browserify	= require('browserify');


let sync = require('browser-sync').init({
	server: {
		baseDir: './release/'
	}
});

task('scss', () => {
	return src('./src/scss/**/*.scss')
		.pipe(sass())
		.pipe(prefixer())
		.pipe(dest('./release/css/'))
		.pipe(sync.stream())
})

task('html', () => {
	return src('./src/html/**/*.html')
		.pipe(include())
		.pipe(dest('./release/'))
		.pipe(sync.stream())
})

task('java', () => {
	return browserify({entries: './src/js/master.js'})
		.transform(babelify, {presets: ['@babel/preset-env']})
		.bundle()
		.pipe(source('master.js'))
		.pipe(dest('./release/js/'))
		.pipe(sync.stream())
})

task('watch', () => {
	watch('./src/html/**/*.html', series('html'));
	watch('./src/scss/**/*.scss', series('scss'));
	watch('./src/js/**/*.js', series('java'));
})