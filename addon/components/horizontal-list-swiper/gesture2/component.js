import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import layout from './template';
import Component from '@ember/component';
import {computed} from '@ember/object';
import {htmlSafe} from '@ember/string';
import {getOwner} from '@ember/application';

const HorizontalSwipeView = Component.extend(RecognizerMixin, {
  window: window,
  layout: layout,
  classNames: ['horizontal-swipe-view', 'ember-appointment-slots-pickers'],
  classNameBindings: ['isTestLike'],
  recognizers: 'swipe',

  // Attributes
  width: 0,
  index: 0,
  onswipe: null,

  init() {
    this._super(...arguments);
    this.items = this.items || [];
  },

  config: computed(function () {
    return getOwner(this).resolveRegistration('config:environment');
  }),
  isTestLike: computed('config', function () {
    const config = this.get('config');
    return config.environment === 'test' ||
      config.environment === 'development' &&
      this.get('window.location.pathname') === '/tests';
  }),

  swipeLeft() {
    const onswipe = this.get('onswipe');
    return onswipe && onswipe(1);
  },

  swipeRight() {
    const onswipe = this.get('onswipe');
    return onswipe && onswipe(-1);
  },

  totalWidth: computed('items.length', 'width', function () {
    return this.get('items.length') * this.get('width');
  }),

  offset: computed('width', 'index', function () {
    return -1 * this.get('width') * this.get('index');
  }),

  style: computed('offset', 'totalWidth', function () {
    const {offset, totalWidth} = this.getProperties('offset', 'totalWidth');

    return htmlSafe(`
      -ms-transform: translate3d(${offset}px,0,0);
      -o-transform: translate3d(${offset}px,0,0);
      -moz-transform: translate3d(${offset}px,0,0);
      -webkit-transform: translate3d(${offset}px,0,0);
      transform: translate3d(${offset}px,0,0);
      width:${totalWidth}px;
    `);
  }),

  styleItem: computed('width', function () {
    const width = this.get('width');
    return htmlSafe(`width:${width}px`);
  })

});

HorizontalSwipeView.reopenClass({
  positionalParams: ['items']
});

export default HorizontalSwipeView;
