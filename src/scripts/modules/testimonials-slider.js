import Splide from '@splidejs/splide';

// slider source: https://splidejs.com/

// function to add a customer slider
const testimonialsSlider = (function() {
  "use strict"

  const init = function () {
    new Splide( '.splide-testimonials', {
      type : 'loop',
      autoHeight: true,
    }).mount();

  };

  return {init};
})();

export default testimonialsSlider;