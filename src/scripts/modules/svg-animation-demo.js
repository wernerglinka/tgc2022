const svgAnimationDemo = () => {
  
  // the animate illustration object to animate lines of a svg drawing
  var animateIllustration = (function () {

    // this hold the event name that we trigger when the animation for this illustration is done
    var end_event_string;

    /**
     * nextStrokeOffset
     * calculate the stroke offset for the next frame
     * @param  {object} thisPath   a jQuery object for a path element
     * @return {function}          a function that calculates the stroke offset
     */
    var nextStrokeOffset = function (thisPath) {
      // get local versions of path frame data
      var maxFrame = thisPath.data('maxFrame');
      var currentFrame = thisPath.data('currentFrame');
      // increase the current frame
      currentFrame++;
      thisPath.data('currentFrame', currentFrame);

      // easeInOutQuad
      // easing function from: https://gist.github.com/gre/1650294
      var easing = function (t) {
        return t < 0.5
          ? 2 * t * t
          : -1 + (4 - 2 * t) * t;
      };

      return Math.min(1, easing(currentFrame / maxFrame));
    };

    /**
     * initPaths
     * prepare all paths the comprise the illustration and store the properties as data on the path
     * @param  {object} paths jQuery collection of all paths
     * @return none
     */
    var initPaths = function (paths) {
      paths.each(function () {
        var path = this;
        var $path = $(this);
        var length = path.getTotalLength();

        $path.data('length', length);
        $path.data('currentFrame', 0);
        $path.data('maxFrame', 150);

        // set initial dash position
        path.style.strokeDasharray = length + ' ' + length;
        path.style.strokeDashoffset = length;
        // make this particular path visible
        $path.show();
      });
    };

    /**
     * drawIllustration
     * draw one frame
     * @param  {object} allPaths a jQuery collection of all paths
     * @return {bool}            false when the animation is done
     */
    var drawIllustration = function (allPaths) {
      var progress;
      // update all paths
      // all paths have the same amount of frames
      allPaths.each(function () {
        var thisPath = $(this);
        progress = nextStrokeOffset(thisPath);
        var length = thisPath.data('length');
        thisPath[0].style.strokeDashoffset = Math.floor(length * (1 - progress));
      });
      if (progress >= 1) {
        return true;
      }
      return false;
    };

    /**
     * dispatch
     * @param  {Function} callback the callback for the specific animation
     * @param  {object}   options  will be past to the callback
     * @return none
     */
    var dispatch = function (callback, options) {
      // "schedule" one callback execution with the next animation frame
      var handle = window.requestAnimationFrame(function () {
        dispatch(callback, options);
      });

      // execute a callback
      // if the callback returns false, cancel the animation frame
      if (callback(options)) {
        window.cancelAnimationFrame(handle);
        // trigger a jQuery custom event so other, sequentials elements
        // can bind to it to start their animations
        if (end_event_string !== 'end') {
          $('body').trigger(end_event_string);
        }
      }
    };

    /**
     * startDrawing
     * Start to draw the illustration
     * @param  {object} paths a jQuery object of the paths that comprise the svg illustration
     * @return none
     */
    var startDrawing = function (paths, end_event) {
      end_event_string = end_event;
      initPaths(paths);
      dispatch(drawIllustration, paths);
    };

    /**
     * Expose the startDrawing as public method
     */
    return {startDrawing: startDrawing};

  }());

  var paths;

  $('.start-animation').on('click', function () {
    // hide all svg line drawings, e.g. all paths
    $('path').hide();

    // start the animation
    paths = $('.animate-rect-1').find('path');
    // pass the illustration paths and the custom event name to be executed when this illustration is done
    animateIllustration.startDrawing(paths, 'next-rect');
  });

  $('body').on('next-rect', function () {
    paths = $('.animate-rect-2').find('path');
    // pass the illustration paths and the custom event name to be executed when this illustration is done
    animateIllustration.startDrawing(paths, 'another-rect');
  });

  $('body').on('another-rect', function () {
    paths = $('.animate-rect-3').find('path');
    // pass the illustration paths and the custom event name to be executed when this illustration is done
    animateIllustration.startDrawing(paths, 'end');
  });
};


export default svgAnimationDemo; 

