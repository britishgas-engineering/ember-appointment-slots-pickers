import { module } from 'qunit';
import {
  test} from 'qunit'; import {setupTest
} from 'ember-qunit';
import moment from 'moment';
import EmberObject from '@ember/object';

module('Unit | Component | slots-picker/base', function (hooks) {
  setupTest(hooks);

  test('onDateChange action', function (assert) {
    const today = moment();
    const cellsPerCol = [
      {col: {dayId: today.toDate()}, cellsForCol: {length: 5}},
      {col: {dayId: today.clone().add(1, 'days').toDate()}, cellsForCol: {length: 2}},
      {col: {dayId: today.clone().add(2, 'days').toDate()}, cellsForCol: {length: 0}},
      {col: {dayId: today.clone().add(3, 'days').toDate()}, cellsForCol: {length: 3}}
    ];
    const component = this.owner.factoryFor('component:slots-picker/base').create({
      baseProps: EmberObject.create({
        cellsPerCol
      }),
      onSelectSlot: sinon.stub()
    });

    component.send('onDateChange', today.clone().add(1, 'days').toDate());

    assert.notOk(component.onSelectSlot.called, 'should not call onSelectSlot if no filter is set');

    component.get('baseProps').set('selectedFilter', true);

    component.send('onDateChange', today.clone().add(9, 'days').toDate());

    assert.notOk(component.onSelectSlot.called, 'should not call onSelectSlot if date outside range');

    component.send('onDateChange', today.clone().add(2, 'days').toDate());

    assert.notOk(component.onSelectSlot.called, 'should not call onSelectSlot if no cells for day');

    component.send('onDateChange', today.clone().add(1, 'days').toDate());

    assert.ok(component.onSelectSlot.called, 'should call onSelectSlot if filters set');
  });
});
