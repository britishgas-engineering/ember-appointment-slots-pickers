import { module } from 'qunit';
import { test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Component | slots-picker/cards', function (hooks) {
  setupTest(hooks);

  test('columnClasses fiveCardsClass', function (assert) {
    const component = this.owner
      .factoryFor('component:slots-picker/cards')
      .create({
        baseProps: {
          days: ['a', 'b', 'c', 'd', 'e'],
        },
      });

    assert.strictEqual(
      component.get('columnClasses'),
      'col-sm-2',
      'col-sm-2 for 5 columns'
    );
    assert.strictEqual(
      component.get('fiveCardsClass'),
      'five-cards',
      'five-cards for 5 columns'
    );

    component.get('baseProps.days').removeObject('e');
    assert.strictEqual(
      component.get('columnClasses'),
      'col-sm-3',
      'col-sm-3 for 4 columns'
    );
    assert.strictEqual(
      component.get('fiveCardsClass'),
      '',
      'no five-cards class for 4 columns'
    );

    component.get('baseProps.days').removeObject('d');
    assert.strictEqual(
      component.get('columnClasses'),
      'col-sm-4',
      'col-sm-4 for 3 columns'
    );
    assert.strictEqual(
      component.get('fiveCardsClass'),
      '',
      'no five-cards class for 3 columns'
    );

    component.get('baseProps.days').removeObject('c');
    assert.strictEqual(
      component.get('columnClasses'),
      'col-sm-6',
      'col-sm-6 for 2 columns'
    );
    assert.strictEqual(
      component.get('fiveCardsClass'),
      '',
      'no five-cards class for 2 columns'
    );

    component.get('baseProps.days').removeObject('b');
    assert.strictEqual(
      component.get('columnClasses'),
      'col-sm-12',
      'col-sm-12 for 1 column'
    );
    assert.strictEqual(
      component.get('fiveCardsClass'),
      '',
      'no five-cards class for 1 column'
    );
  });
});
