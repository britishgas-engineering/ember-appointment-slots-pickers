import { computed } from '@ember/object';
import noDelayOnTransitionsInTest from '../no-delay-on-transitions-in-test/component';
import { inject as service } from '@ember/service';
import { run } from '@ember/runloop';
import $ from 'jquery';
import layout from './template';

export default noDelayOnTransitionsInTest.extend({
  layout: layout,
  classNames: ['scroll-header-sly', 'ember-appointment-slots-pickers'],

  viewport: service(),
  window: window,//TODO: use service instead

  index: null, //day at the middle
  indexUpdate: null,
  speed: computed('isTestLike', function () {
    const isTestLike = this.get('isTestLike');
    return isTestLike ? 0 : 300;
  }),
  swingSpeed: 0.2,
  isDragging: true,
  'active-item-alignment': 'basic',
  sly: null,

  init() {
    this._super(...arguments);
    this.items = this.items || [];
    this.itemsUpdate = this.itemsUpdate || [];
  },

  _afterRenderInit() {
    if (this.isDestroyed) {
      return false;
    }
    this.get('sly').init();
    const $slidee = this.$('.scroll-header-sly-slidee');
    let width = $slidee.width();
    //handle the larger bubble for currentIndex.
    //Dont see a better way to do that with Sly. Bloody designers.
    width = width + 30;
    $slidee.css('width', `${width}px`);
    //immediate
    return this.sly.toCenter(this.get('indexUpdate') || 0, true);
  },

  _afterRenderSlyActive() {
    if (this.isDestroyed) {
      return false;
    }
    return this.get('onactive')(this.get('sly').rel.activeItem);
  },

  _indexFromPosition: computed(function () {
    const items = this.get('sly').items;
    const cur = this.get('sly').pos.cur;
    let index;
    for (let i = 0, l = items.length; i < l; i += 1) {
      const item = items[i];

      if (item.center - item.half <= cur && cur <= item.center + item.half) {
        index = i + (cur - item.center) / item.size;
        break;
      }
    }
    return index;
  }).volatile(),//eslint-disable-line

  _afterRenderSlyMove() {
    if (this.isDestroyed) {
      return false;
    }
    const index = this.get('_indexFromPosition');
    if (this.get('isDragging')) {
      const indexRounded = Math.round(index);
      this.$('.scroll-header-sly-item').removeClass('active');
      this.$(`.scroll-header-sly-item:eq(${indexRounded})`).addClass('active');
    }
    return this.get('onmove')(index);
  },

  _afterRenderSlyMoveEnd() {
    if (this.isDestroyed) {
      return false;
    }
    const index = this.get('_indexFromPosition');
    return this.get('onmoveend')(index);
  },

  _afterRenderReload() {
    if (this.isDestroyed) {
      return false;
    }
    //this.get('sly').reload();
    this.set('isDragging', false);
    run.later(
      this,
      () => {
        if (this.isDestroyed) {
          return false;
        }
        this.set('isDragging', true);
        return true;
      },
      this.speed
    );
    //with animation
    return this.get('sly').toCenter(this.get('index'), false);
  },

  didInsertElement() {
    this.set('isDragging', true);
    const Sly = this.get('window.Sly');
    const centered = ['centered', 'forceCentered'].includes(this.get('active-item-alignment'));
    // Instantiate sly
    this.set(
      'sly',
      new Sly(this.$('.scroll-header-sly-frame'), {
        // https://github.com/darsain/sly/blob/master/docs/Options.md
        horizontal: true,
        itemNav: this.get('active-item-alignment'),
        smart: centered,
        activateMiddle: centered,
        // Dragging
        touchDragging: true,
        mouseDragging: true,
        releaseSwing: false,
        elasticBounds: true,
        swingSpeed: this.get('swingSpeed'),
        // Animation
        speed: this.get('speed')
      })
    );

    if (this.get('onactive')) {
      this.get('sly').on('active', () => {
        run.scheduleOnce('afterRender', this, '_afterRenderSlyActive');
      });
    }

    if (this.get('onmove')) {
      this.get('sly').on('move', () => {
        run(() => {
          run.scheduleOnce('afterRender', this, '_afterRenderSlyMove');
        });
      });
    }
    if (this.get('onmoveend')) {
      this.get('sly').on('moveEnd', () => {
        run(() => {
          run.scheduleOnce('afterRender', this, '_afterRenderSlyMoveEnd');
        });
      });
    }

    run.scheduleOnce('afterRender', this, '_afterRenderInit');

    this._resizeHandler = this._reload.bind(this);
    $(this.get('window.windowObject')).on('resize', this._resizeHandler);
    $(this.get('window.windowObject')).on('orientationchange', this._resizeHandler);
  },

  _reload() {
    run.scheduleOnce('afterRender', this, '_afterRenderReload');
  },

  _afterUpdateItems() {
    const sly = this.get('sly');
    if (sly) {
      sly.reload();
      this._reload();
    }
  },

  didUpdateAttrs() {
    this._super(...arguments);
    const indexUpdate = this.get('indexUpdate');
    const index = this.get('index');
    if (this.get('sly') && index !== indexUpdate) {
      this.set('index', indexUpdate);
      this._reload();
    }
    const itemsUpdate = this.get('itemsUpdate');
    const items = this.get('items');
    if (this.get('sly') && items !== itemsUpdate) {
      this.set('items', itemsUpdate);
      run.scheduleOnce('afterRender', this, '_afterUpdateItems');
    }
  },

  willDestroyElement() {
    $(window).off('resize', this._resizeHandler);
    $(window).off('orientationchange', this._resizeHandler);
    this.get('sly').destroy();
  }
});
