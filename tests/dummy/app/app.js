import Application from '@ember/application';
import Ember from 'ember';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import {on} from 'rsvp';
import {run} from '@ember/runloop';

let App;

Ember.MODEL_FACTORY_INJECTIONS = true;

App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver,
  LOG_TRANSITIONS: ['development', 'test'].includes(config.environment),
  LOG_TRANSITIONS_INTERNAL: ['development', 'test'].includes(config.environment),
});

if (config.environment === 'development') {
  run.backburner.DEBUG = true;// slow
  // Log errors potentially swallowed by promises
  // (see https://guides.emberjs.com/v1.12.0/understanding-ember/debugging/)
  on('error', function (error) {
    Ember.Logger.assert(false, error);
  });
  Ember.onerror = function (error) {
    Ember.Logger.assert(false, error);
  };
}


loadInitializers(App, config.modulePrefix);

export default App;
