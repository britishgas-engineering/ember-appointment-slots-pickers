import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';
import { run } from '@ember/runloop';

export default Component.extend({

  layout: layout,

  scroll: service(),
  logger: console,

  tagName: 'div',
  name: '',
  teleport: null,
  autoscroll: false,
  stayOnTopOf: null,

  classNames: [
    'scroll-anchor',
    'ember-appointment-slots-pickers'
  ],

  classNameBindings: [
    'className'
  ],

  className: computed('name', function () {
    return 'scroll-anchor' + this.name;
  }),

  didInsertElement: function () {
    this._super.apply(...arguments);
    const scroll = this.scroll;

    if (this.name) {
      // Register this anchor against the scroll service
      scroll.set('_anchors.' + this.name, {
        $el: this.$(),
        options: {
          teleport: this.teleport,
          stayOnTopOf: this.stayOnTopOf
        }
      });

      if (this.autoscroll) {
        this.logger.info(`autoscroll to ${this.name}`);
        run.next(() => {
          scroll.to(this.name);
        });
      }

    }
  },

  willDestroyElement: function () {
    const scroll = this.scroll;
    this._super.apply(...arguments);

    if (this.name) {
      // Unregister this anchor from the scroll service
      scroll.set('_anchors.' + this.name, null);
    }
  }

});
