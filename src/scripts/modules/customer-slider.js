import Splide from '@splidejs/splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';

// function to add a customer slider
const customerSlider = (function() {
  "use strict"

  const init = function () {
    new Splide( '.splide' ).mount( { AutoScroll } );
  };

  return {init};
})();

export default customerSlider;