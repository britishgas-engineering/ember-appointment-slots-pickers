import $ from 'jquery';
import Component from '@ember/component';

export default Component.extend({
  classNames: ['application-pre-loader', 'ember-appointment-slots-pickers'],

  didInsertElement: function () {
    //go to the bottom of screen if smaller than it
    const height = $(window).height() - $(this.element).offset().top;
    if (height > 0) {
      $(this.element).height(height);
    }
  },
});
