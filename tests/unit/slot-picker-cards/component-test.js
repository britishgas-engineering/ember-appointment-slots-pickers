
import {module} from 'qunit';
import {test} from 'qunit'; import {setupTest} from 'ember-qunit';

module('Unit | Component | slot-picker-cards', function (hooks) {
  setupTest(hooks);

  test('columnClasses fiveCardsClass', function (assert) {
    const component = this.owner.factoryFor('component:slot-picker-cards').create({
      baseProps: {
        days: ['a', 'b', 'c', 'd', 'e']
      }
    });

    assert.equal(
      component.get('columnClasses'),
      'col-sm-2',
      'col-sm-2 for 5 columns'
    );
    assert.equal(
      component.get('fiveCardsClass'),
      'five-cards',
      'five-cards for 5 columns'
    );

    component.get('baseProps.days').removeObject('e');
    assert.equal(
      component.get('columnClasses'),
      'col-sm-3',
      'col-sm-3 for 4 columns'
    );
    assert.equal(
      component.get('fiveCardsClass'),
      '',
      'no five-cards class for 4 columns'
    );

    component.get('baseProps.days').removeObject('d');
    assert.equal(
      component.get('columnClasses'),
      'col-sm-4',
      'col-sm-4 for 3 columns'
    );
    assert.equal(
      component.get('fiveCardsClass'),
      '',
      'no five-cards class for 3 columns'
    );

    component.get('baseProps.days').removeObject('c');
    assert.equal(
      component.get('columnClasses'),
      'col-sm-6',
      'col-sm-6 for 2 columns'
    );
    assert.equal(
      component.get('fiveCardsClass'),
      '',
      'no five-cards class for 2 columns'
    );

    component.get('baseProps.days').removeObject('b');
    assert.equal(
      component.get('columnClasses'),
      'col-sm-12',
      'col-sm-12 for 1 column'
    );
    assert.equal(
      component.get('fiveCardsClass'),
      '',
      'no five-cards class for 1 column'
    );
  });
});
