const gulp = require('gulp');

module.exports = function processIcons() {
  console.log('Moving Icons ************************************');
  return gulp
    .src('./src/sources/assets/icons/**.*')
    .pipe(gulp.dest(`./src/assets/icons`));
};
