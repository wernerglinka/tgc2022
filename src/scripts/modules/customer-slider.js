import Splide from '@splidejs/splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';

// slider source: https://splidejs.com/

// function to add a customer slider
const customerSlider = (function() {
  "use strict"

  const init = function () {
    new Splide( '.js-splide-customers', {type : 'loop'}).mount( { AutoScroll } );
  };

  return {init};
})();

export default customerSlider;