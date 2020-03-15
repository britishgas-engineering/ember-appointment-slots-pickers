import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class BgButtonComponent extends Component {

  // whether the button is loading state or not
  // can not use @trakced with #loadingPrivate, and @tracked is needed for isDisabled template updating test
  @tracked loadingPrivate = false;

  get isLoading() {
    return this.args.loading || this.loadingPrivate;
  }

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

  get bgTheme() {
    return `btn-${this.theme}`;
  }

  constructor() {
    super(...arguments);
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
