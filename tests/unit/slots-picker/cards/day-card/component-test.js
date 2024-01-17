import { module } from 'qunit';
import { test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Component | slots-picker/cards/day-card', function (hooks) {
  setupTest(hooks);

  test('appointmentSlotsNotEmpty', function (assert) {
    const component = this.owner
      .factoryFor('component:slots-picker/cards/day-card')
      .create({
        appointmentSlots: [
          null,
          'appointmentSlot1',
          undefined,
          'appointmentSlot2',
        ],
      });

    assert.strictEqual(
      component.get('appointmentSlotsNotEmpty.length'),
      2,
      'only non-empty appointmentSlots are shown'
    );
  });
});
