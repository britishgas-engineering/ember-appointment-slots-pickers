import { findAll, find, render } from '@ember/test-helpers';
import EmberObject from '@ember/object';
import { test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

module('Integration | Component | slot-picker-selection-single', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders with no selection', async function (assert) {
    assert.expect(1);

    await render(hbs`{{slot-picker-selection-single}}`);

    assert.notOk(findAll('p').length, 'should not render any message');
  });

  test('it renders with a selection', async function (assert) {
    assert.expect(4);

    this.set('baseProps', EmberObject.create({
      multiSelected: [
        EmberObject.create({
          slotPickerLongDayLabel: 'LABEL',
          slotPickerStartTimeLabel: 'START',
          slotPickerEndTimeLabel: 'END'
        })
      ]
    }));

    await render(hbs`{{slot-picker-selection-single baseProps=this.baseProps}}`);

    assert.ok(findAll('p').length, 'should render a p tag if there is a selection');
    assert.ok(find('p').textContent.trim().match(/LABEL/), 'should contain longDayLabel');
    assert.ok(find('p').textContent.trim().match(/START/), 'should contain startTimeLabel');
    assert.ok(find('p').textContent.trim().match(/END/), 'should contain endTimeLabel');
  });
});
