/* jshint node: true */
'use strict';
const MergeTrees = require('broccoli-merge-trees');

const Funnel = require('broccoli-funnel');

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
  },
  _treeShakingEmber(tree) {
    const options = this.app.options[this.name];
    let treeShakingOptions = {};
    console.log('options', options, this.app.options, this.name);
    if (options) {
      if (options.bundles) {
        options.exclude = options.exclude || [];
        const bundles = options.bundles;
        if (bundles.includes('bg')) {
          console.log('includes bg');
          options.exclude.push(
            /services\/scroll/,
            /services\/viewport/,
            /helpers/,
            /global-rules/,
            /styles\/mixins/,
            /styles\/variables/,
            /components\/application-pre-loader/,
            /components\/bg-button/,
            /components\/scroll-anchor/
          )
        } else {
          console.log('not includes bg');
        }
        delete options.bundles;
      }
      treeShakingOptions = Object.assign({}, {
        enabled: true,
        include: options.include || null,
        exclude: options.exclude || null
      });
    }
    return new Funnel(tree, treeShakingOptions);
  },
  treeForAddon() {
    const tree = this._super.treeForAddon.apply(this, arguments);
    return this._treeShakingEmber(tree);
  },

  treeForApp(appTree) {
    const trees = [this._treeShakingEmber(appTree)];
    return new MergeTrees(trees, {
      overwrite: true
    });
  },
};
