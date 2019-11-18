import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('demo', function () {
    this.route('slots-filter');
    this.route('slots-pickers', function () {
      this.route('slot-picker-name', {path: '/:slot-picker-name'});//eslint-disable-line
    });
    this.route('clock-reloader');
    this.route('horizontal-scroll-view');
    this.route('date-pickers', function () {
      this.route('mobile');
    });
    this.route('horizontal-list-swipers', function () {
      this.route('sly');
      this.route('gesture');
      this.route('gesture2');
    });
  });
});

export default Router;
