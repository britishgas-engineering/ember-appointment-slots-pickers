import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('demo', function () {
    this.route('slot-picker-filter');
    this.route('slot-pickers', function () {
      this.route('slot-picker-name', {path: '/:slot-picker-name'});//eslint-disable-line
    });
    this.route('scroll-header');
    this.route('slot-picker-refresher-container');
    this.route('horizontal-scroll-view');
    this.route('scroll-header-sly');
    this.route('date-picker-mobile');
  });
});

export default Router;
