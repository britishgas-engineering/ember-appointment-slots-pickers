import { test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { module } from 'qunit';
import { next } from '@ember/runloop';

module('Unit | Component | horizontal-list-swiper/gesture', function (hooks) {
  setupTest(hooks);

  test('.swipeLeft()', function (assert) {
    assert.expect(1);
    const component = this.owner
      .factoryFor('component:horizontal-list-swiper/gesture')
      .create({
        recognizers: null,
        goToNextItem: sinon.stub(),
      });

    component.swipeLeft();

    assert.ok(component.get('goToNextItem.called'));
  });

  test('.swipeRight()', function (assert) {
    assert.expect(1);
    const component = this.owner
      .factoryFor('component:horizontal-list-swiper/gesture')
      .create({
        recognizers: null,
        goToPreviousItem: sinon.stub(),
      });

    component.swipeRight();

    assert.ok(component.get('goToPreviousItem.called'));
  });

  test('.goToNextItem()', function (assert) {
    assert.expect(2);
    const component = this.owner
      .factoryFor('component:horizontal-list-swiper/gesture')
      .create({
        recognizers: null,
        isLastPage: true,
        currentItem: 0,
        itemsPerPage: 3,
      });

    component.goToNextItem();
    assert.strictEqual(
      component.get('currentItem'),
      0,
      "does not move to the next item if it's on the last page"
    );

    component.set('isLastPage', false);

    component.goToNextItem();
    assert.strictEqual(
      component.get('currentItem'),
      3,
      "moves to the next item if it's not on the last page"
    );
  });

  test('.goToPreviousItem()', function (assert) {
    assert.expect(2);
    const component = this.owner
      .factoryFor('component:horizontal-list-swiper/gesture')
      .create({
        recognizers: null,
        isFirstPage: true,
        currentItem: 4,
        itemsPerPage: 3,
      });

    component.goToPreviousItem();
    assert.strictEqual(
      component.get('currentItem'),
      4,
      "does not move to the next item if it's on the first page"
    );

    component.set('isFirstPage', false);

    component.goToPreviousItem();
    assert.strictEqual(
      component.get('currentItem'),
      1,
      "moves to the next item if it's not on the first page"
    );
  });

  test('testing currentItem when index is 3', function (assert) {
    assert.expect(1);
    const component = this.owner
      .factoryFor('component:horizontal-list-swiper/gesture')
      .create({
        recognizers: null,
        currentItem: 0,
        itemsPerPage: 3,
        index: 3,
      });
    component.didInsertElement();
    next(this, function () {
      assert.strictEqual(
        component.get('currentItem'),
        3,
        'calculatedCurrentItem value'
      );
    });
  });

  test('testing currentItem when index is 0', function (assert) {
    assert.expect(1);
    const component = this.owner
      .factoryFor('component:horizontal-list-swiper/gesture')
      .create({
        recognizers: null,
        currentItem: 0,
        itemsPerPage: 3,
        index: 0,
      });

    component.didInsertElement();

    next(this, function () {
      assert.strictEqual(
        component.get('currentItem'),
        0,
        'calculatedCurrentItem value'
      );
    });
  });

  test('testing currentItem when index is 6', function (assert) {
    assert.expect(1);
    const component = this.owner
      .factoryFor('component:horizontal-list-swiper/gesture')
      .create({
        recognizers: null,
        currentItem: 0,
        itemsPerPage: 5,
        index: 6,
      });

    component.didInsertElement();

    next(this, function () {
      assert.strictEqual(
        component.get('currentItem'),
        5,
        'calculatedCurrentItem value'
      );
    });
  });

  test('testing currentItem when index is 11', function (assert) {
    assert.expect(1);
    const component = this.owner
      .factoryFor('component:horizontal-list-swiper/gesture')
      .create({
        recognizers: null,
        currentItem: 0,
        itemsPerPage: 5,
        index: 11,
      });

    component.didInsertElement();

    next(this, function () {
      assert.strictEqual(
        component.get('currentItem'),
        10,
        'calculatedCurrentItem value'
      );
    });
  });

  test('testing currentItem when index is 0 then later 11', function (assert) {
    assert.expect(1);
    const component = this.owner
      .factoryFor('component:horizontal-list-swiper/gesture')
      .create({
        recognizers: null,
        currentItem: 0,
        itemsPerPage: 5,
        index: 0,
      });

    component.didInsertElement();

    next(this, function () {
      component.set('index', 11);
      assert.strictEqual(
        component.get('currentItem'),
        10,
        'currentItem is updated'
      );
    });
  });
});
