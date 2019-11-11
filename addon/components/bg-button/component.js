import {or} from '@ember/object/computed';
import {computed} from '@ember/object';
import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,

  tagName: 'button',
  classNames: ['bg-button', 'btn', 'ember-appointment-slots-pickers'],
  classNameBindings: ['bgTheme'],
  attributeBindings: ['isDisabled:disabled', 'type', 'tabindex'],

  // attributes
  // whether the button is disabled or not
  disabled: false,

  // whether the button is loading state or not
  loading: false,

  // can be "primary" "secondary" "tertiary"
  theme: 'primary',

  // can be "button" "submit" "reset"
  type: 'button',

  // text to display when the button is in loading state
  'loading-text': 'Loading...',

  // wheter to hide the left arrow icon
  'hide-icon': false,

  customIcon: null,

  // persist loading even after the promise has returned
  forceLoadingToPersist: false,

  bgTheme: computed('theme', function () {
    return `btn-${this.get('theme')}`;
  }),

  // computed properties of disable and loading
  isDisabled: or('disabled', 'loading'),

  click(...params) {
    if (this.attrs.action) {
      const promise = this.attrs.action(...params);

      // if the action is a closure action
      // and a promise set loading state
      // until resolved
      if (
        promise &&
        promise.then &&
        !this.get('isDestroyed') &&
        !this.get('isDestroying')
      ) {
        this.set('loading', true);
        promise.finally(() => {
          if (!this.get('isDestroyed') && !this.get('isDestroying') && !this.get('forceLoadingToPersist')) {
            this.set('loading', false);
          }
        });
      }
    }
    return false;
  }

});
