import { test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { module } from 'qunit';

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
        isRendered: false,
        currentItem: 2,
        items: ['tests', '2', '3'],
      });

    component.goToNextItem();
    assert.strictEqual(
      component.get('currentItem'),
      2,
      "does not move to the next item if it's on the last page"
    );

    component.set('currentItem', 0);

    component.goToNextItem();
    assert.strictEqual(
      component.get('currentItem'),
      1,
      "moves to the next item if it's not on the last page"
    );
  });

  test('.goToPreviousItem()', function (assert) {
    assert.expect(2);
    const component = this.owner
      .factoryFor('component:horizontal-list-swiper/gesture')
      .create({
        recognizers: null,
        isRendered: false,
        currentItem: 0,
        items: ['tests', '2', '3'],
      });

    component.goToPreviousItem();
    assert.strictEqual(
      component.get('currentItem'),
      0,
      "does not move to the next item if it's on the first page"
    );

    component.set('currentItem', 2);

    component.goToPreviousItem();
    assert.strictEqual(
      component.get('currentItem'),
      1,
      "moves to the next item if it's not on the first page"
    );
  });
});
