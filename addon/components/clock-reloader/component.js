import { Promise as EmberPromise } from 'rsvp';
import { later, cancel } from '@ember/runloop';
import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout: layout,
  // Attributes
  delay: 0,
  refresh: null,

  isExpired: false,

  /**
   * Tag the curren model
   * as non-expired and
   * add a timeout using
   * user specified delay
   * @return {void}
   */
  setup() {
    this.set('isExpired', false);
    if (this.delay < 1000000000) {
      // qunit's 'andThen' waits for all promises to finish, including Ember.run.later
      // we completely remove the run.later here for very big delay values
      // to be able to test the beahviour of the component when not expired
      this.runLater = later(this, this.expire, this.delay);
    }
  },

  /**
   */
  /**
   * Tag the current model
   * as expired
   * @return {void}
   */
  expire() {
    this.set('isExpired', true);
  },

  /**
   * Start running the
   * counter to expiry
   * @return {void}
   */
  didInsertElement() {
    this.setup();
  },

  /**
   * Make sure to cleanup
   * the timeout
   * @return {void}
   */
  willDestroyElement() {
    cancel(this.runLater);
  },

  actions: {
    /**
     * Trigger the refresh action
     * @return {Promise} calls this.setup() if attrs.onrefresh is a function
     */
    refresh() {
      return new EmberPromise((resolve, reject) => {
        try {
          const setupAndResolve = () => {
            this.setup();
            resolve();
          };

          const action = this.onrefresh();

          const isActionPromise = !!action.then;

          if (isActionPromise) {
            action.then(setupAndResolve, reject);
          } else {
            // action is not a promise
            setupAndResolve();
          }
        } catch (e) {
          // action was not passed simple resolve()
          resolve();
        }
      });
    }
  }

});
