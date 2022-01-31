import $ from 'jquery';
import { computed } from '@ember/object';
import { lt, gte } from '@ember/object/computed';
import { debounce } from '@ember/runloop';
import Service from '@ember/service';

export default Service.extend({

  init() {
    this._super(...arguments);

    this.set('_windowResizehandler', () => {
      this._setHeightAndWidth();
      debounce(this, '_setHeightAndWidth', 100);
    });

    const $el = this._$el;
    $el.on('resize', this._windowResizehandler);
    $el.on('orientationchange', this._windowResizehandler); // iOS iphone 10..

    this._setHeightAndWidth();
  },

  willDestroy() {
    this._super(...arguments);
    const $el = this._$el;
    $el.off('resize', this._windowResizehandler);
    $el.off('orientationchange', this._windowResizehandler);
  },

  el: window,

  height: 0,
  width: 0,
  bootstrapHeight: 0,
  bootstrapWidth: 0,

  isXs: lt('bootstrapWidth', 768),

  isSm: computed('bootstrapWidth', function () {
    const width = this.bootstrapWidth;

    return width >= 768 && width < 992;
  }),

  isMd: computed('bootstrapWidth', function () {
    const width = this.bootstrapWidth;

    return width >= 992 && width < 1200;
  }),

  isLg: gte('bootstrapWidth', 1200),
  isMobile: lt('bootstrapWidth', 480),

  _$el: computed('el', function () {
    return $(this.el);
  }),

  _setHeightAndWidth() {
    if (!this.isDestroyed) {
      const $el = this._$el;

      const viewportWithScrollBar = this.viewportWithScrollBar();

      this.setProperties({
        height: $el.height(),
        width: $el.width(),
        bootstrapWidth: viewportWithScrollBar.width,
        bootstrapHeight: viewportWithScrollBar.height
      });
    }
  },

  viewportWithScrollBar() {// width including the scrollbar (for media queries)
    // http://stackoverflow.com/questions/11309859/css-media-queries-and-javascript-window-width-do-not-match
    let e = window;

    let a = 'inner';

    if (!('innerWidth' in window)) {
      a = 'client';
      e = document.documentElement || document.body;
    }
    return {
      width: e[a + 'Width'],
      height: e[a + 'Height']
    };
  }

});
