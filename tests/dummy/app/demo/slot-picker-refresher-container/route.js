import { later } from '@ember/runloop';
import { Promise as EmberPromise } from 'rsvp';
import Route from '@ember/routing/route';

export default Route.extend({
  actions: {
    refresh() {
      return new EmberPromise((resolve) => {
        later(resolve, 3000);
      });
    }
  }
});
