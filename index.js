/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-appointment-slots-pickers',
  included: function (app) {
    this.app = app;
    this._super.included.apply(this, arguments);

    this.import('node_modules/pickadate/lib/picker.js');
    this.import('node_modules/pickadate/lib/picker.date.js');
    this.import('node_modules/pickadate/lib/themes/default.date.css');
    this.import('node_modules/sly-shim/dist/sly.min.js');
    this.import('node_modules/bootstrap/dist/js/bootstrap.js');
    this.import('node_modules/bootstrap/dist/css/bootstrap.min.css');
  },
  isDevelopingAddon: function () {
    if (this.env === 'test') {
      return false;
    }
    return true;
  }
};
