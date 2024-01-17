import { module } from 'qunit';
import { test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Component | easy-slot-picker', function (hooks) {
  setupTest(hooks);

  test('slotPickerComponentName responsiveBreak', function (assert) {
    const component = this.owner
      .factoryFor('component:easy-slot-picker')
      .create({
        viewport: {
          isMobile: false,
        },
      });

    assert.strictEqual(
      component.get('slotPickerComponentName'),
      'slots-picker/desktop',
      'slots-picker-/esktop returned for large viewports'
    );

    component.set('viewport.isMobile', true);

    assert.strictEqual(
      component.get('slotPickerComponentName'),
      'slots-picker/mobile',
      'slots-picker/mobile returned for small viewports'
    );
  });
});
