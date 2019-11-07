import {module} from 'qunit';
import {test} from 'qunit'; import {setupTest} from 'ember-qunit';
import {settled} from '@ember/test-helpers';

module('Unit | Component | scroll-header-sly', function (hooks) {
  setupTest(hooks);

  test('isDragging', function (assert) {
    const component = this.owner.factoryFor('component:scroll-header-sly').create({
      speed: 10,
      sly: {
        toCenter() {}
      },
      _indexFromPosition: 0,
      attrs: {
        onmove: sinon.stub()
      }
    });
    assert.ok(component.isDragging, 'isDragging true initially');
    component._afterRenderReload();
    assert.notOk(this.isDragging, 'isDragging is false on _afterRenderReload when moving to a different index');
    component._afterRenderSlyMove();
    assert.ok(component.attrs.onmove.called);
    return settled().then(() => {
      assert.ok(component.isDragging, 'isDragging back to true after speed timer elapses');
    });
  });
});
