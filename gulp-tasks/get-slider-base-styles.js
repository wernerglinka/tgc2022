const gulp = require('gulp');
const rename = require("gulp-rename");
require('dotenv');

// slider source: https://splidejs.com/

module.exports = function () {
	console.log(`Loading slider base styles *****************************`);
  return gulp.src(`node_modules/@splidejs/splide/dist/css/splide-core.min.css`)
		.pipe(rename("slider-base-styles.css"))
		.pipe(gulp.dest('src/assets/styles'));
};

 
