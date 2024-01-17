import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';

import { render, settled, findAll } from '@ember/test-helpers';

let windowMock;

let slyConstructorStub;

let sly;

module('Integration | Component | horizontal-list-swiper/sly', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  hooks.beforeEach(function () {
    slyConstructorStub = sinon.stub();
    windowMock = {
      Sly: function () {
        this.init = sinon.stub();
        this.on = sinon.stub();
        this.toCenter = sinon.stub();
        this.destroy = sinon.stub();
        this.rel = {activeItem: 'activeItem'};
        this.pos = {cur: 0};
        this.items = [];
        this.reload = sinon.stub();
        sly = this;
        slyConstructorStub(...arguments);
      }
    };
  });

  test('initializes sly', async function (assert) {
    this.set('window', windowMock);
    await render(hbs`
      <HorizontalListSwiper::Sly @window={{window}} />
    `);
    assert.ok(slyConstructorStub.called, 'A new instance of Sly was created');
    assert.ok(sly.init.called, 'sly was initialized');
  });

  test('centers element', async function (assert) {
    this.set('window', windowMock);
    this.set('items', [1, 2, 3]);
    this.set('indexUpdate', 0);
    await render(hbs`
      <HorizontalListSwiper::Sly @window={{window}} @indexUpdate={{indexUpdate}} @itemsUpdate={{items}} as |item|>
        {{item}}
      </HorizontalListSwiper::Sly>
    `);
    assert.ok(sly.toCenter.calledWith(0, true), 'Center on selected element index on first render without animation');
    this.set('indexUpdate', 1);
    assert.ok(sly.toCenter.calledWith(1, false), 'Center on selected element index when provided with animation');
    sly.toCenter = sinon.stub();
    this.set('indexUpdate', 1);
    assert.notOk(sly.toCenter.called, 'Do not attempt to center if the element index is unchanged');
  });

  test('updates items', async function (assert) {
    this.set('window', windowMock);
    this.set('items', [1, 2, 3]);
    this.set('indexUpdate', 0);
    await render(hbs`
      <HorizontalListSwiper::Sly @window={{window}} @indexUpdate={{indexUpdate}} @itemsUpdate={{items}} as |item|>
        {{item}}
      </HorizontalListSwiper::Sly>
    `);
    assert.dom('.scroll-header-sly-item').exists({ count: 3 }, '3 items shown');
    this.set('items', [1, 2, 3, 4]);
    assert.ok(sly.reload.called, 'sly reload has been called');
    assert.dom('.scroll-header-sly-item').exists({ count: 4 }, '4 items shown');
  });

  test('reacts to move events', async function (assert) {
    const onmove = sinon.stub();
    const onmoveend = sinon.stub();
    this.set('window', windowMock);
    this.actions.onmove = onmove;
    this.actions.onmoveend = onmoveend;
    await render(hbs`
      <HorizontalListSwiper::Sly @window={{window}} @onmove={{action "onmove"}} @onmoveend={{action "onmoveend"}} />
    `);
    const slyOnMoveCallback = sly.on.args.find((arg) => arg[0] === 'move')[1];
    const slyOnMoveEndCallback = sly.on.args.find((arg) => arg[0] === 'moveEnd')[1];
    run(() => {
      slyOnMoveCallback();
    });
    return settled().then(() => {
      assert.ok(onmove.called, 'onmove action is triggered when sly moves');
      assert.notOk(onmoveend.called, 'onmoveend action is not triggered when sly moves');
      run(() => {
        slyOnMoveEndCallback();
      });
      return settled();
    }).then(() => {
      assert.ok(onmoveend.called, 'onmoveend action is triggered when sly moves end');
    });
  });

  test('reacts to activate events', async function (assert) {
    const onactive = sinon.stub();
    this.set('window', windowMock);
    this.actions.onactive = onactive;
    await render(hbs`
      <HorizontalListSwiper::Sly @window={{window}} @onactive={{action "onactive"}} />
    `);
    const slyOnActiveCallback = sly.on.args.find((arg) => arg[0] === 'active')[1];
    run(() => {
      slyOnActiveCallback();
    });
    assert.ok(onactive.calledWith('activeItem'), 'onactive action is triggered when sly moves');
  });
});
