import layout from './template';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,
  title: 'Loading..',
  viewport: service(),
  showSkeletonSlotImage: computed('viewport', function() {
    const baseURL = this.get('baseURL') || '/ember-appointment-slots-pickers/images/';
    let url = '';

    if (this.get('viewport.isXs')) {
      url = `${baseURL}mobile.svg`
    } else if(this.get('viewport.isMd')) {
      url = `${baseURL}tablet.svg`
    } else {
      url = `${baseURL}desktop.svg`
    }

    return url;
  })

});
