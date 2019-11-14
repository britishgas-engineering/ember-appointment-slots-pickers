import { module } from 'qunit';
import {
  test} from 'qunit'; import {setupTest
} from 'ember-qunit';
import EmberObject from '@ember/object';
import moment from 'moment';

module('Unit | Component | slot-picker/pickadate', function (hooks) {
  setupTest(hooks);

  test('jsDays computed property', function (assert) {
    const component = this.owner.factoryFor('component:slot-picker/pickadate').create({
      baseProps: {
        days: ['20180101', '20180102']
      }
    });

    assert.equal(
      component.get('jsDays').length,
      component.get('days').length,
      'jsDays returns array with length equal to days length'
    );

    assert.equal(
      _getDateAsStringFromJavaScriptDateObject(0),
      '1/1/2018',
      'jsDays returns first day as native javascript date.'
    );

    assert.equal(
      _getDateAsStringFromJavaScriptDateObject(1),
      '2/1/2018',
      'jsDays returns last day as native javascript date.'
    );

    function _getDateAsStringFromJavaScriptDateObject(i) {
      const dateObj = component.get('jsDays')[i];
      return dateObj.getDate() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getFullYear();
    }
  });

  test('min computed property', function (assert) {
    const component = this.owner.factoryFor('component:slot-picker/pickadate').create({
      baseProps: {
        days: ['20180213', '20180214', '20180215']
      }
    });

    assert.equal(
      component.get('min')[0],
      2018,
      'min returns year of firstObject as first item in the array'
    );

    assert.equal(
      component.get('min')[1],
      1,
      'min returns month of firstObject as second item in the array'
    );

    assert.equal(
      component.get('min')[2],
      13,
      'min returns date of firstObject as first item in the array'
    );

  });

  test('max computed property', function (assert) {
    const component = this.owner.factoryFor('component:slot-picker/pickadate').create({
      baseProps: {
        days: ['20180213', '20180214', '20180215']
      }
    });

    assert.equal(
      component.get('max')[0],
      2018,
      'max returns year of lastObject as first item in the array'
    );

    assert.equal(
      component.get('max')[1],
      1,
      'max returns month of lastObject as second item in the array'
    );

    assert.equal(
      component.get('max')[2],
      15,
      'max returns date of lastObject as first item in the array'
    );
  });

  test('currentDay', function (assert) {
    const component = this.owner.factoryFor('component:slot-picker/pickadate').create({
      selected: null
    });

    assert.equal(component.get('currentDay'), null, 'should return null for no selection');

    component.set('selected', EmberObject.create({slotPickerDay: '20190602'}));

    assert.equal(component.get('currentDay'), moment('20190602').valueOf(), 'should retrieve correct day from slot');
  });

  test('onSelectDate action', function (assert) {
    const component = this.owner.factoryFor('component:slot-picker/pickadate').create({
      set: sinon.stub(),
      onSelectSlot: sinon.stub(),
      _scrollToSlotsOnlyIfNotOnInit: sinon.stub()
    });
    const onDateChangeStub = sinon.stub(component.actions, 'onDateChange');
    const today = (new Date()).valueOf();

    component.send('onSelectDate', today);

    assert.ok(component.get('set').calledWith('currentDay', today), 'should set currentDay');
    assert.ok(component.get('onSelectSlot').calledWith(null), 'should clear selected slot');
    assert.ok(onDateChangeStub.calledWith(today), 'should call onDateChange with date');

    onDateChangeStub.resetHistory();

    component.setProperties({currentDay: today});
    component.send('onSelectDate', today);

    assert.notOk(onDateChangeStub.called, 'should not call change callback');
  });
});
