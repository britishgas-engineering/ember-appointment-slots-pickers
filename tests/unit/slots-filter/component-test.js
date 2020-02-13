import { module } from 'qunit';
import {
  test} from 'qunit'; import {setupTest
} from 'ember-qunit';
import EmberObject from '@ember/object';

module('Unit | Component | slots-filter', function (hooks) {
  setupTest(hooks);

  const appointmentSlots = [
    EmberObject.create({
      slotPickerRowId: '08001000'
    }),
    EmberObject.create({
      slotPickerRowId: '10001200'
    }),
    EmberObject.create({
      slotPickerRowId: '12001400'
    }),
    EmberObject.create({
      slotPickerRowId: '14001600'
    }),
    EmberObject.create({
      slotPickerRowId: '08001000'
    }),
    EmberObject.create({
      slotPickerRowId: '10001200'
    }),
    EmberObject.create({
      slotPickerRowId: '12001400'
    }),
    EmberObject.create({
      slotPickerRowId: '14001600'
    })
  ];

  test('filteredAppointmentSlots is appointment-slots filtered by selectedFilter', function (assert) {
    const component = this.owner.factoryFor('component:slots-filter').create({
      appointmentSlots,
      selectedFilter: {
        id: '08001000'
      }
    });
    assert.equal(
      component.get('filteredAppointmentSlots').length,
      2,
      'filteredAppointmentSlots has 2 items'
    );
    assert.equal(
      component.get('filteredAppointmentSlots')[0],
      appointmentSlots[0],
      'the 1st element of filteredAppointmentSlots is the 1st element of appointmentSlots'
    );
    assert.equal(
      component.get('filteredAppointmentSlots')[1],
      appointmentSlots[4],
      'the 2nd element of filteredAppointmentSlots is the 5th element of appointmentSlots'
    );
  });

  test('filteredAppointmentSlots is simply appointment-slots if selectedFilter is not defined', function (assert) {
    const component = this.owner.factoryFor('component:slots-filter').create({
      appointmentSlots
    });
    assert.equal(
      component.get('filteredAppointmentSlots').length,
      appointmentSlots.length,
      'filteredAppointmentSlots and appointmentSlots have the same length'
    );
    component.get('filteredAppointmentSlots').forEach((filteredAppointmentSlot, index) => {
      assert.equal(
        filteredAppointmentSlot,
        appointmentSlots[index],
        `the element ${index} of filteredAppointmentSlots is the element ${index} of appointmentSlots`
      );
    });
  });

  test('changeFilter action', function (assert) {
    const component = this.owner.factoryFor('component:slots-filter').create({
      onFilter: sinon.stub()
    });

    component.send('changeFilter', true);

    assert.ok(component.get('onFilter').called, 'should call the onFilter callback');
  });
});
