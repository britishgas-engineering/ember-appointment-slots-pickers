import { module } from 'qunit';
import { test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Component | slots-filter/ui', function (hooks) {
  setupTest(hooks);

  test('filterButtonClick should toggle the areTimeSlotsHidden property', function (assert) {
    const component = this.owner
      .factoryFor('component:slots-filter/ui')
      .create();
    assert.ok(
      component.get('areTimeSlotsHidden'),
      'areTimeSlotsHidden should be true'
    );
    component.send('filterButtonClick');
    assert.notOk(
      component.get('areTimeSlotsHidden'),
      'areTimeSlotsHidden should be false'
    );
  });

  test('timeSlotButtonClick should reset areTimeSlotsHidden and call changeFilter', function (assert) {
    const changeFilter = sinon.stub();
    const timeSlots = [
      {
        id: '08001000',
      },
      {
        id: '10001200',
      },
      {
        id: '12001400',
      },
      {
        id: '14001600',
      },
    ];
    const component = this.owner
      .factoryFor('component:slots-filter/ui')
      .create({
        changeFilter,
        timeSlots,
      });
    component.send('timeSlotButtonClick', {
      get: () => '08001000',
    });
    assert.ok(
      component.get('areTimeSlotsHidden'),
      'areTimeSlotsHidden should be true'
    );
    assert.strictEqual(
      changeFilter.args.length,
      1,
      'changeFilter should be called once'
    );
    const changeFilterArgs = changeFilter.args[0];
    assert.strictEqual(
      changeFilterArgs.length,
      1,
      'changeFilter should be called with one argument'
    );
    assert.strictEqual(
      changeFilterArgs[0].get('id'),
      '08001000',
      'changeFilter should be called with the clicked time slot as second argument'
    );
  });

  test('areSlotsEven should be true when the number of filter options is even', function (assert) {
    const component = this.owner
      .factoryFor('component:slots-filter/ui')
      .create({
        timeSlots: [{}, {}, {}],
      });
    assert.ok(
      component.get('areSlotsEven'),
      'areSlotsEven should be true when 3+"Show all" filter slots are present'
    );
  });

  test('areSlotsEven should be false when the number of filter options is odd', function (assert) {
    const component = this.owner
      .factoryFor('component:slots-filter/ui')
      .create({
        timeSlots: [{}, {}, {}, {}],
      });
    assert.notOk(
      component.get('areSlotsEven'),
      'areSlotsEven should be false when 4+"Show all" filter slots are present'
    );
  });
});
