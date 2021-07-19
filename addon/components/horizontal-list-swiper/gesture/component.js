import { inject as service } from '@ember/service';
import { equal } from '@ember/object/computed';
import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import Ember from 'ember';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import layout from './template';
import { run } from '@ember/runloop';
import {getOwner} from '@ember/application';

const {
  String
} = Ember;

export default Component.extend(RecognizerMixin, {
  window,
  layout,
  viewport: service(),
  recognizers: 'swipe',
  classNameBindings: ['isTestLike'],

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
    this.goToNextItem();
  },

  swipeRight() {
    this.goToPreviousItem();
  },

  goToNextItem() {
    if (!this.get('isLastPage')) {
      this.incrementProperty('currentItem', this.get('itemsPerPage'));
    }
  },

  goToPreviousItem() {
    if (!this.get('isFirstPage')) {
      this.decrementProperty('currentItem', this.get('itemsPerPage'));
    }
  },

  classNames: [
    'asp-scroll', 'ember-appointment-slots-pickers'
  ],

  /**
   * Represents the index of the left most
   * item currently and entirely in view
   * @type {Number}
   */
  currentItem: 0,

  width: computed('isRendered', 'viewport.width', function () {
    this.get('viewport.width');
    return this.get('isRendered') ? this.$().width() : 0;
  }),

  scrollAreaWidth: computed('itemWidth', 'items.length', function () {
    return this.get('itemWidth') * this.get('items.length');
  }),

  itemWidth: computed('isRendered', 'viewport.width', 'items.length', 'currentItem', function () {
    this.get('viewport.width');//to refresh when viewport is refreshed. A bit strange, but needed
    //items.length is needed, too (when going from 0 to X items)
    return this.get('isRendered') ? this.$('.asp-scroll-area > :first-child').width() : 0;
  }), // 120

  scrollAreaOffset: computed(
    'currentItem',
    'currentPage',
    'itemWidth',
    'itemsPerPage',
    'isLastPage',
    'isFirstPage',
    'scrollAreaWidth',
    'width',
    function () {
      let offset;

      if (this.get('isLastPage') && !this.get('isFirstPage')) {
        offset = this.get('scrollAreaWidth') - this.get('width');
      } else {
        offset = this.get('currentItem') * this.get('itemWidth');
      }
      return -offset;
    }
  ),

  scrollAreaStyle: computed('scrollAreaWidth', 'scrollAreaOffset', function () {
    const width = this.get('scrollAreaWidth');
    const display = !width && this.get('displayAfterRender') ? 'none' : '';

    const offset = this.get('scrollAreaOffset');
    return String.htmlSafe(`
      width: ${width}px;
      display: ${display};
      -ms-transform: translate3d(${offset}px,0,0);
      -o-transform: translate3d(${offset}px,0,0);
      -moz-transform: translate3d(${offset}px,0,0);
      -webkit-transform: translate3d(${offset}px,0,0);
      transform: translate3d(${offset}px,0,0);
    `);
  }),

  pages: computed('items.length', 'itemsPerPage', function () {
    return Math.ceil(this.get('items.length') / this.get('itemsPerPage'));
  }),

  currentPage: computed('currentItem', 'itemsPerPage', function () {
    return Math.floor(this.get('currentItem') / this.get('itemsPerPage'));
  }),

  itemsPerPage: computed('width', 'itemWidth', function () {
    if (!this.get('itemWidth')) {
      return 1;
    }
    return Math.floor(this.get('width') / this.get('itemWidth'));
  }),

  isFirstPage: equal('currentPage', 0),

  isLastPage: computed('currentPage', 'pages', function () {
    return this.get('currentPage') === this.get('pages') - 1;
  }),

  _recomputeItemWidth() {
    if (!this.isDestroyed) {
      this.set('isRendered', true);
      this.notifyPropertyChange('itemWidth');
      this._onIndexChange();
    }
  },

  didInsertElement() {
    //needed when not loading the slots sync
    this._super(...arguments);
    run.next(this, '_recomputeItemWidth');
  },

  didUpdateAttrs() {
    //needed when loading the slots async, at least when
    //no loader so keeping it to be on the safe side
    this._super(...arguments);
    run.next(this, '_recomputeItemWidth');
  },

  //case where appointment.appointmentSlot resolves later (appointment.appointmentSlot.content is initially null)
  _onIndexChange: observer('index', function () {//eslint-disable-line
    const index = this.get('index');
    if (!this.isDestroyed && index !== undefined) {
      this.set(
        'currentItem',
        Math.floor(index / this.get('itemsPerPage')) * this.get('itemsPerPage')
      );
    }
  }),

  actions: {

    /**
     * Slide to the next set of items
     * @return {undefined}
     */
    next() {
      this.goToNextItem();
    },

    /**
     * Slide to the previous set of items
     * @return {undefined}
     */
    prev() {
      this.goToPreviousItem();
    }
  },


});
