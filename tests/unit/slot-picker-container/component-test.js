import moment from 'moment';
import EmberObject from '@ember/object';
import ObjectProxy from '@ember/object/proxy';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import RSVP from 'rsvp';
import DS from 'ember-data';
import { run } from '@ember/runloop';
import { settled } from '@ember/test-helpers';

module('Unit | Component | slot-picker-container', function (hooks) {
  setupTest(hooks);

  const today = moment();
  const twoDaysAgoDateNotDisplayable = EmberObject.create({
    slotPickerNotDisplayable: true,
    slotPickerAvailable: true,
    slotPickerRowLabel: 'bli',
    slotPickerDay: moment(today).add(-2, 'day').format('YYYYMMDD'),
    slotPickerRowId: 'twoDaysAgo bli',
    slotPickerTime: 'twoDaysAgo'
  });
  const yesterdayDate = EmberObject.create({
    slotPickerAvailable: true,
    slotPickerRowLabel: 'bla',
    slotPickerDay: moment(today).add(-1, 'day').format('YYYYMMDD'),
    slotPickerTime: 'yesterday'
  });
  const todayDate = EmberObject.create({
    slotPickerAvailable: true,
    slotPickerRowLabel: 'bla',
    slotPickerDay: moment(today).add(0, 'day').format('YYYYMMDD'),
    slotPickerRowId: 'today bla',
    slotPickerTime: 'today'
  });
  const tomorrowDate = EmberObject.create({
    slotPickerAvailable: true,
    slotPickerRowLabel: 'bla',
    slotPickerDay: moment(today).add(1, 'day').format('YYYYMMDD'),
    slotPickerRowId: 'tomorrow bla',
    slotPickerTime: 'tomorrow'
  });
  const tomorrowDate2 = EmberObject.create({
    slotPickerAvailable: true,
    slotPickerRowLabel: 'ble',
    slotPickerDay: moment(today).add(1, 'day').format('YYYYMMDD'),
    slotPickerRowId: 'tomorrow ble',
    slotPickerTime: 'tomorrow2'
  });
  const tomorrowDateUnavailable = EmberObject.create({
    slotPickerAvailable: false,
    slotPickerRowLabel: 'blu',
    slotPickerDay: moment(today).add(1, 'day').format('YYYYMMDD'),
    slotPickerRowId: 'tomorrow blu',
    slotPickerTime: 'tomorrow3'
  });

  test('cellsPerCol', function (assert) {
    const component = this.owner.factoryFor('component:slot-picker-container').create({
      appointmentSlots: [
        yesterdayDate,
        todayDate,
        tomorrowDate,
        tomorrowDate2,
        tomorrowDateUnavailable,
        twoDaysAgoDateNotDisplayable
      ],
      store: {
        createRecord(modelName, data) {
          return EmberObject.create(data);
        }
      }
    });
    assert.equal(component.get('availableAppointmentSlots.length'), 5, '5 days available');
    assert.notOk(
      component.get('cellsPerCol.firstObject.cellsForCol').filter((slot) => !!slot).length,
      'we added a first column without slots because of the "slotPickerNotDisplayable" slot'
    );

    component.get('appointmentSlots').removeObject(twoDaysAgoDateNotDisplayable);
    assert.equal(component.get('availableAppointmentSlots.length'), 4, '4 days available');
    assert.ok(
      component.get('cellsPerCol.firstObject.cellsForCol').filter((slot) => !!slot).length,
      'the first column now has slots'
    );

    component.get('appointmentSlots').removeObject(yesterdayDate);
    assert.equal(component.get('availableAppointmentSlots.length'), 3, '3 days available');

    component.get('appointmentSlots').removeObject(todayDate);
    assert.equal(component.get('availableAppointmentSlots.length'), 2, '2 day available');

    component.get('appointmentSlots').removeObject(tomorrowDate);
    component.get('appointmentSlots').removeObject(tomorrowDate2);
    assert.equal(component.get('availableAppointmentSlots.length'), 0, '0 day available');
  });

  test('adds back selected slot to the list of availableSlots', function (assert) {
    const component = this.owner.factoryFor('component:slot-picker-container').create({
      appointmentSlots: [
        todayDate,
        tomorrowDateUnavailable
      ],
      selected: tomorrowDateUnavailable
    });

    assert.equal(component.get('availableAppointmentSlots.length'), 2, '2 days available as the (unavailable) selected slot is added back');
    component.set('selected', 'bla');
    assert.equal(component.get('availableAppointmentSlots.length'), 2, 'availableSelectedSlots doesnt change when selected is updated');
  });

  test('onSelectSlot, external action', function (assert) {
    const component = this.owner.factoryFor('component:slot-picker-container').create({
      appointmentSlots: [
        todayDate,
        tomorrowDateUnavailable
      ],
      select() {
      }
    });
    component.send('onSelectSlot', todayDate);
    return settled().then(() => {
      assert.notOk(component.get('multiSelected')[0], 'not changing selected as should be done by the parent providing the action');
    });
  });

  test('slotsAreLoading - no appointmentSlots', function (assert) {
    const component = this.owner.factoryFor('component:slot-picker-container').create({
      appointmentSlots: [],
      attrs: {},
      selected: tomorrowDate
    });
    assert.ok(
      component.get('slotsAreLoading'),
      'slots are loading if not slots, even with a selected slot'
    );
  });

  test('slotsAreLoading - appointmentSlots isPending', function (assert) {
    const promiseAsyncSlots = new RSVP.Promise(function (resolve) {
      run.later(this, function () {
        resolve();
      }, 5000);
    });
    const asyncSlots = DS.PromiseArray.create({promise: promiseAsyncSlots});
    const component = this.owner.factoryFor('component:slot-picker-container').create({
      appointmentSlots: asyncSlots,
      attrs: {},
      selected: tomorrowDate
    });
    assert.ok(
      component.get('slotsAreLoading'),
      'slots are loading if appointmentSlots is a pending promiseObject, even with a selected slot'
    );
  });

  test('multiSelected', function (assert) {
    const component = this.owner.factoryFor('component:slot-picker-container').create();
    const dummySlot = {};
    const anotherDummySlot = {};
    const dummySlotProxy = ObjectProxy.create();
    let selections;

    // set up proxy with dummy slot
    dummySlotProxy.content = dummySlot;

    selections = component.get('multiSelected');

    assert.deepEqual(selections, [], 'should return empty list of selections');

    component.set('selected', dummySlot);

    selections = component.get('multiSelected');

    assert.deepEqual(selections, [dummySlot], 'should return list containing single selection');

    component.set('selected', [dummySlot]);

    selections = component.get('multiSelected');

    assert.deepEqual(selections, [dummySlot], 'should return list containing single selection list');

    component.set('selected', [dummySlot, anotherDummySlot]);

    selections = component.get('multiSelected');

    assert.deepEqual(selections, [dummySlot, anotherDummySlot], 'should return list containing selection list');

    component.set('selected', dummySlotProxy);

    selections = component.get('multiSelected');

    assert.deepEqual(selections, [dummySlot], 'should return list containing single selection from proxy');

    component.set('selected', [dummySlotProxy]);

    selections = component.get('multiSelected');

    assert.deepEqual(selections, [dummySlot], 'should return list containing single selection list from proxy');

    component.set('selected', [dummySlotProxy, anotherDummySlot]);

    selections = component.get('multiSelected');

    assert.deepEqual(selections, [dummySlot, anotherDummySlot], 'should return list containing selection list from mix');
  });
});
