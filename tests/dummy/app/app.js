import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'dummy/config/environment';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

// if (config.environment === 'development') {
//   run.backburner.DEBUG = true;// slow
//   // Log errors potentially swallowed by promises
//   // (see https://guides.emberjs.com/v1.12.0/understanding-ember/debugging/)
//   on('error', function (error) {
//     console.error(error);//eslint-disable-line
//   });
//   Ember.onerror = function (error) {
//     console.error(error);//eslint-disable-line
//   };
// }

loadInitializers(App, config.modulePrefix);
