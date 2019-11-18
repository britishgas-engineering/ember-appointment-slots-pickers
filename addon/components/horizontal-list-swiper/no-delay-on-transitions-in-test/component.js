import Component from '@ember/component';
import layout from './template';
import {getOwner} from '@ember/application';
import { computed } from '@ember/object';

export default Component.extend({
  layout,
  window: window,
  classNameBindings: ['isTestLike'],
  config: computed(function () {
    return getOwner(this).resolveRegistration('config:environment');
  }),
  isTestLike: computed('config', function () {
    const config = this.get('config');
    return config.environment === 'test' ||
      config.environment === 'development' &&
      this.get('window.location.pathname') === '/tests';
  }),
});
