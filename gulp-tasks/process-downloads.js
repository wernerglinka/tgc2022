const gulp = require('gulp');

module.exports = function processDownloads() {
  console.log('Moving Downloads ************************************');
  return gulp
    .src('./src/sources/assets/downloads/**.*')
    .pipe(gulp.dest(`./src/assets/downloads`));
};
