//import {or} from '@ember/object/computed';
//import {computed} from '@ember/object';
import Component from '@glimmer/component';
//import layout from './template';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { oneWay } from '@ember/object/computed';
// import {
//   layout as templateLayout,
// } from '@ember-decorators/component';
// import layout from './template';

// @templateLayout(layout)
export default class BgButtonComponent extends Component {
  //layout = layout;
  //layout,

  //tagName: 'button',
  //classNames: ['bg-button', 'btn', 'ember-appointment-slots-pickers'],
  //classNameBindings: ['bgTheme'],
  //attributeBindings: ['isDisabled:disabled', 'type', 'tabindex'],

  // get isTagged() {
  //   return this.args.isTagged || false;
  // }

  // attributes
  // whether the button is disabled or not
  // get disabled() {
  //   return this.args.disabled || false;
  // }

  // whether the button is loading state or not
  // can not use @trakced with #loadingPrivate, and @tracked is needed for isDisabled template updating test
  @tracked loadingPrivate = false;

  get isLoading() {
    return this.args.loading || this.loadingPrivate;
  }

  // //force 2-ways binding, not quite sure how to do differently (lack of @oneWay computed macro etc.)
  // set isLoading(loading) {
  //   this.args.loading = loading;
  // }

  // can be "primary" "secondary" "tertiary"
  get theme() {
    return this.args.theme || 'primary';
  }

  // can be "button" "submit" "reset"
  get type() {
    return this.args.type || 'button';
  }

  // text to display when the button is in loading state
  get loadingText() {
     return this.args['loading-text'] || 'Loading...';
  }

  // wheter to hide the left arrow icon
  // get 'hide-icon'() {
  //    return this.args['hide-icon'] || false;
  // }

  // get customIcon() {
  //   return this.args.customIcon || null;
  // }
  //
  // get forceLoadingToPersist() {
  //   return this.args.forceLoadingToPersist || null;
  // }

  get bgTheme() {
    return `btn-${this.theme}`;
  }

  constructor() {
    super(...arguments);
    console.log('constructor', this, this.args);
  }

  //computed properties of disable and loading
  //isDisabled: or('disabled', 'loading'),
  get isDisabled() {
    return this.args.disabled || this.isLoading;
  }

  @action
  onClick(...params) {
    //https://github.com/emberjs/ember.js/issues/18748
    const aktion = this.args.action;
    if (aktion) {
      const promise = aktion(...params);

      // if the action is a closure action
      // and a promise set loading state
      // until resolved
      if (
        promise &&
        promise.then &&
        !this.isDestroyed &&
        !this.isDestroying
      ) {
        this.loadingPrivate = true;
        promise.finally(() => {
          if (!this.isDestroyed && !this.isDestroying && !this.args.forceLoadingToPersist) {
            this.loadingPrivate = false;
          }
        });
      }
    }
    return false;
  }

}
