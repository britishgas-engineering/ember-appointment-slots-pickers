import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Component | slot-picker-desktop', function (hooks) {
  setupTest(hooks);

  test('selectedDayIndex', function (assert) {
    const component = this.owner.factoryFor('component:slot-picker-desktop').create({
      baseProps: EmberObject.create({
        multiSelected: [
          EmberObject.create({
            dayLabel: 'DAY2'
          })
        ],
        cols: [
          EmberObject.create({
            dayLabel: 'DAY1'
          }),
          EmberObject.create({
            dayLabel: 'DAY2'
          })
        ]
      })
    });

    assert.equal(component.get('selectedDayIndex'), 1, 'should return the correct index for a selected day');

    component.get('baseProps.multiSelected').pushObject(EmberObject.create({
      dayLabel: 'DAY1'
    }));

    assert.notOk(component.get('selectedDayIndex'), 'should return nothing for multiple selections');
  });
});
