import {merge} from '@ember/polyfills';
import {scheduleOnce, run} from '@ember/runloop';
import $ from 'jquery';
import EmberObject, {computed} from '@ember/object';
import Service, {inject as service} from '@ember/service';
import {getOwner} from '@ember/application';

export default Service.extend({

  viewport: service(),
  window: window,//TODO: use window service

  config: computed(function () {
    return getOwner(this).resolveRegistration('config:environment');
  }),

  /**
   * isTestLike is true when env is development and runnig tests in browser
   * or environment = test
   * @param  {String} 'config' key
   * @param  {Function} function compution callback
   * @return {Boolean}
   */
  isTestLike: computed('config', function () {
    const config = this.get('config');
    return config.environment === 'test' ||
      config.environment === 'development' &&
      this.get('window.location.pathname') === '/tests';
  }),

  _minimumDuration: 500,

  _anchors: EmberObject.create({}),

  _maximumDuration: computed('_minimumDuration', function () {
    return this.get('_minimumDuration') * 4;
  }),

  _headerHeight: computed('viewport.width', function () {
    // unary plus is used here
    // https://developer.mozilla.org/hu/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Unary_plus_()
    const $header = $('#addon-bg-header .navbar');

    return +($header.css('position') === 'fixed' && $header.outerHeight(true));
  }),

  _velocity: computed('viewport.height', '_minimumDuration', function () {
    const maxDistance = this.get('viewport.height') / 2;

    return maxDistance / this.get('_minimumDuration');
  }),

  init() {
    this._super(...arguments);
    this.scrollStopEventNames = this.scrollStopEventNames || [
      'scroll',
      'mousedown',
      'DOMMouseScroll',
      'mousewheel',
      'keyup',
      'touchstart'
    ];
  },

  /**
   * calling the scroll (only in dev, staging or production)
   * @param  {string}  name      name of anchor
   * @param  {Mixed}   options   options object or callback function
   * @param  {Function} callback callback function
   * @return {undefined}
   */
  to: function (name, options, callback) {
    if (!this.get('configService.isTestLike')) {
      //console.log('scroll to', name);
      scheduleOnce('afterRender', this, this.afterRenderTo, name, options, callback);
    }
  },

  // html and body needed as well
  // chrome supports body
  // firefox body
  // ie God knows
  $page: $('html, body'),

  /**
   * Removing events when service has been destroyed
   * @return {undefined}
   */
  willDestroy() {
    this.get('$page').off(
      this.scrollStopEventNames.join(' '),
      this.onScrollStop
    );
  },

  afterRenderTo(name, options, callback) {
    run(() => {
      if (typeof options === 'function') {
        callback = options;
        options = null;
      }

      /**
       * Cancel the page's animation and remove
       * event listeners for onScrollStop callback
       * @return {undefined}
       */
      this.onScrollStop = run.bind(this, function () {
        const $page = this.get('$page');

        const scrollStopEventNames = this.scrollStopEventNames;

        const onScrollStop = this.onScrollStop;

        $page.stop();
        if (callback) {
          callback();
        }
        return $page.off(
          scrollStopEventNames.join(' '),
          onScrollStop
        );
      });

      const $page = this.get('$page');

      const scrollStopEventNames = this.scrollStopEventNames;

      const onScrollStop = this.onScrollStop;

      const $anchor = this.get(`_anchors.${name}.$el`);

      const anchorOptions = this.get(`_anchors.${name}.options`);

      const instanceOptions = {};

      const minimumDuration = this.get('_minimumDuration');

      const maximumDuration = this.get('_maximumDuration');

      let scrollTopDestination;

      let scrollTopOrigin;

      let distance;

      let duration;

      let $stayOnTopElement;

      merge(instanceOptions, anchorOptions || {});
      merge(instanceOptions, options || {});

      if ($anchor && $anchor.length) {
        scrollTopDestination = $anchor.offset().top -
          this.get('_headerHeight') -
          (instanceOptions.adjustment || 0);

        if (instanceOptions.stayOnTopOf) {
          $stayOnTopElement = $(instanceOptions.stayOnTopOf);
          if ($stayOnTopElement.length) {
            const windowObject = this.get('window.windowObject');
            if (windowObject) {
              scrollTopDestination = Math.min(
                scrollTopDestination,
                $stayOnTopElement.offset().top -
                $(windowObject).height()
              );
            }
          }
        }
        scrollTopOrigin = $page.scrollTop();
        distance = scrollTopDestination - scrollTopOrigin;

        if (instanceOptions.teleport === 'always' || instanceOptions.teleport === 'smart' && distance < 0) {
          $page.scrollTop(scrollTopDestination);
        } else {

          duration = Math.abs(distance) / this.get('_velocity');

          if (duration < minimumDuration) {
            duration = minimumDuration;
          }

          if (duration > maximumDuration) {
            duration = maximumDuration;
          }

          // Allows user to cancel scroll
          // to prevent jittering
          $page.on(scrollStopEventNames.join(' '), onScrollStop);

          $page.animate({
            scrollTop: scrollTopDestination
          }, duration || 300, 'swing', onScrollStop);

        }
      }
    });
  }
});
