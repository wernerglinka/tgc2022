const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const util = require('gulp-util');
const fs = require('fs');
const path = require('path');

// get fonts
const processFonts = require('./gulp-tasks/get-google-fonts');
// process styles 
const processStyles = require('./gulp-tasks/process-styles');
// get prism styles
const getPrismStyles = require('./gulp-tasks/get-prism-styles');
// process scripts
const processScripts = require('./gulp-tasks/process-scripts');
// clean build folder
const cleanAssets = require('./gulp-tasks/clean');
// process animations
const processAnimations = require('./gulp-tasks/process-animations');
// Metalsmith build site process
const metalsmith = require('./gulp-tasks/metalsmith');

// for "gulp", "util.env.production" will be undefined,"!!util.env.production" will coerce to boolean true
// for "gulp --production", "util.env.production" will be true
// source: https://j11y.io/javascript/truthy-falsey/
const isProduction = !!util.env.production;
// utility variable used to check all links
const isLinkCheck = !!util.env.linkcheck;

// Function to reload the browser
function reload(done) {
  browserSync.reload();
  done();
}

// Function to watch all relevant source files and update browser accordingly
// source: https://browsersync.io/docs/gulp
// this function is only used during site development
// 404 display source: https://github.com/browsersync/browser-sync/issues/1398
function watchSite(done) {
  if (!isProduction) {
    // get content of 404.htm to display under the wrong url 
    // only in dev, in production this needs to be done on the server
    // Netlify picks up 404.html automatically
    const content_404 = fs.readFileSync(path.join(__dirname, 'build/404.html'));

    browserSync.init({
      server: {
        baseDir: './build/',
      },
    }, (err, bs) => {
      bs.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
      });
    });

    console.log('watching');

    gulp.watch(
      'src/scripts/**/*.js',
      gulp.series(processScripts, metalsmith, reload)
    );
    gulp.watch(
      'src/styles/**/*.scss',
      gulp.series(processStyles,metalsmith, reload)
    );
    gulp.watch(
      'src/content/**/*.md.njk', 
      gulp.series(metalsmith, reload)
    );
  }
  done();
}


exports.default = gulp.series(
  cleanAssets,
  processAnimations,
  processScripts,
  processFonts,
  processStyles,
  getPrismStyles,
  metalsmith,
  watchSite
);

exports.buildProd = gulp.series(
  cleanAssets,
  processAnimations,
  processScripts,
  processStyles,
  getPrismStyles,
  metalsmith
);
