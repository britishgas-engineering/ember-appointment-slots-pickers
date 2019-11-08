import {computed} from '@ember/object';
import {inject as service} from '@ember/service';
import Component from '@ember/component';
import layout from './template';
import {run} from '@ember/runloop';

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
    'scroll-anchor'
  ],

  classNameBindings: [
    'className'
  ],

  className: computed('name', function () {
    return 'scroll-anchor' + this.get('name');
  }),

  didInsertElement: function () {
    this._super.apply(...arguments);
    const scroll = this.get('scroll');

    if (this.get('name')) {
      // Register this anchor against the scroll service
      scroll.set('_anchors.' + this.get('name'), {
        $el: this.$(),
        options: {
          teleport: this.get('teleport'),
          stayOnTopOf: this.get('stayOnTopOf')
        }
      });

      if (this.get('autoscroll')) {
        this.get('logger').info(`autoscroll to ${this.get('name')}`);
        run.next(() => {
          scroll.to(this.get('name'));
        });
      }

    }
  },

  willDestroyElement: function () {
    const scroll = this.get('scroll');
    this._super.apply(...arguments);

    if (this.get('name')) {
      // Unregister this anchor from the scroll service
      scroll.set('_anchors.' + this.get('name'), null);
    }
  }

});
