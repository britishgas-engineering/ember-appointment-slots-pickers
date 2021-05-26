/* jshint node: true */
'use strict';
const MergeTrees = require('broccoli-merge-trees');
const Funnel = require('broccoli-funnel');

module.exports = {
  name: 'ember-appointment-slots-pickers',
  included: function (app) {
    this.app = app;
    this._super.included.apply(this, arguments);
    const options = app.options[this.name];
    const exclude = options && options.bundles && options.bundles.exclude || [];
    if (!exclude.includes('pickadate')) {
      this.import('node_modules/pickadate/lib/picker.js');
      this.import('node_modules/pickadate/lib/picker.date.js');
      this.import('node_modules/pickadate/lib/themes/default.date.css');
    }
    if (!exclude.includes('mobile')) {
      this.import('node_modules/sly-shim/dist/sly.min.js');
    }
    if (!exclude.includes('bg') && !exclude.includes('bootstrap') ) {
      this.import('node_modules/bootstrap/dist/css/bootstrap.min.css');
    }
  },
  isDevelopingAddon: function () {
    if (this.env === 'test') {
      return false;
    }
    return true;
  },
  _getHostApp: function() {
    if (!this._findHost) {
      this._findHost = function findHostShim() {
        let current = this;
        let app;
        do {
          app = current.app || app;
        } while (current.parent.parent && (current = current.parent));
        return app;
      };
    }

    return this._findHost();
  },
  _debug() {
    //console.log(...arguments);
  },
  _treeShakingEmber(tree) {
    const options = this.app.options[this.name];
    let treeShakingOptions = {};
    if (options) {
      options.include = options.include || [];
      if (options.bundles) {

        if (options.bundles.include && options.bundles.include.length) { //files needed for any calendar
          Array.prototype.push.apply(options.include, [
            /components\/slots-picker\/base/,
            /components\/slots-picker\/button/,
            /components\/slots-picker\/slots-loader/,
            /components\/application-pre-loader/,
            /components\/slots-picker\/selection-multi/,
            /components\/slots-picker\/selection-single/,
            /components\/horizontal-list-swiper\/no-delay-on-transitions-in-test/,
            /slots-picker\/component/,
            /slots-picker\/styles/,
            /slots-picker\/template/,
            /components\/bg-button/,
            /services/,
            /helpers/,
            '**/ember-appointment-slots-pickers.css'
          ]);
        }

        ['exclude', 'include'].forEach((includeOrExclude) => {
          options[includeOrExclude] = options[includeOrExclude] || [];
          let bundles = options.bundles[includeOrExclude] || [];
          if (bundles.includes('easy')) {
            bundles = bundles.filter((elt) => elt !== 'easy');
            bundles.push('desktop', 'mobile');
            options[includeOrExclude].push(/components\/easy-slot-picker/);
          }
          bundles.forEach((bundleName) => {
            let patterns = [];
            switch(bundleName) {
              case 'bg':
                patterns = [
                  /services\/scroll/,
                  /services\/viewport/,
                  /helpers/,
                  '**/global-rules.less',
                  '**/variables.less',
                  /components\/slots-picker\/slots-loader/,
                  /components\/application-pre-loader/,
                  /components\/bg-button/,
                  /components\/scroll-anchor/
                ];
                break;
              case 'mobile':
                patterns = [
                  /horizontal-list-swiper\/sly/,
                  /components\/date-picker\/mobile/,
                  /components\/date-picker\/mobile\/styles/,
                  /horizontal-list-swiper\/gesture2/,
                  /components\/slots-picker\/mobile/
                ];
                break;
              case 'pickadate':
                patterns = [
                  /components\/pickadate-input/,
                  /components\/slots-picker\/pickadate/
                ];
                break;
              case 'desktop':
                patterns = [
                  /horizontal-list-swiper\/gesture/,
                  /components\/slots-picker\/desktop/
                ];
                break;
              case 'cards':
                patterns = [
                  /components\/slots-picker\/cards/
                ];
                break;
              default:
                console.error('unrecognized bundle for ember-appointment-slots-pickers tree-shaking: ', bundleName); break;//eslint-disable-line
            }
            Array.prototype.push.apply(options[includeOrExclude], patterns);
          });
        })
        delete options.bundles;
      }
      if (options.include.length) {
        Array.prototype.push.apply(options.include, [
          '**/addon.less',
          '**/mixins.less'
        ]);
      } //otherwise everything is included by default
      this._debug('ember-appointment-slots-pickers treeShaking debug:', options);
      treeShakingOptions = Object.assign({}, {
        enabled: true,
        include: options.include || null,
        exclude: options.exclude || null
      });
    }
    const funnel = new Funnel(tree, treeShakingOptions);
    return funnel;
  },
  treeForAddon() {
    const tree = this._super.treeForAddon.apply(this, arguments);
    return this._treeShakingEmber(tree);
  },
  //https://ember-cli.com/api/files/lib_models_addon.js.html#LINENUM_933
  ////check https://github.com/ember-engines/ember-engines/blob/master/lib/engine-addon.js
  ///https://github.com/ember-engines/ember-engines/blob/master/lib/engine-addon.js#L682
  treeForStyles(tree) {
    if (!tree) {
      return tree;
    }
    const newTree = this._treeShakingEmber(tree);
    return this._super.treeForStyles.apply(this, newTree);
  },

  treeForApp(appTree) {
    const trees = [this._treeShakingEmber(appTree)];
    return new MergeTrees(trees, {
      overwrite: true
    });
  },

  //this is never run, and I don't know why..
  /*treeForParentAddonStyles(tree) {
    return tree;
  },*/

  _treeFor(name) {
    const tree = this._super._treeFor.apply(this, arguments);
    if (name === 'addon-styles') {
      //treeForParentAddonStyles hook is never run, I don't know why
      const finalTree = this._treeShakingEmber(tree);
      return finalTree;
    }
    return tree;
  }

};
