const gulp = require('gulp');

module.exports = function processImages() {
  console.log('Moving Images ************************************');
  return gulp
    .src('./src/sources/assets/images/**.*')
    .pipe(gulp.dest(`./src/assets/images`));
};
