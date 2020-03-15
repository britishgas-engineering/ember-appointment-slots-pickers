import { click, findAll, find, render } from '@ember/test-helpers';
import EmberObject from '@ember/object';
import { test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

module('Integration | Component | slots-picker/selection-multi', async function (hooks) {
  setupRenderingTest(hooks);

  test('it renders with no selection', async function (assert) {
    assert.expect(1);

    this.set('baseProps', EmberObject.create({
      canSelectMultipleSlots: []
    }));

    await render(hbs`<SlotsPicker::SelectionMulti @baseProps={{this.baseProps}} />`);

    assert.notOk(findAll('p').length, 'should not render any message');
  });

  test('it renders with a selection', async function (assert) {
    // assert.expect(3);

    const now = new Date();
    const yesterday = moment(now).clone().subtract('days', 1).toDate();

    this.set('baseProps', EmberObject.create({
      multiSelected: [
        EmberObject.create({
          slotPickerDayLabel: 'LABEL',
          slotPickerStartTimeLabel: 'START',
          slotPickerEndTimeLabel: 'END',
          slotPickerTime: now
        }),
        EmberObject.create({
          slotPickerDayLabel: 'LABEL1',
          slotPickerStartTimeLabel: 'START1',
          slotPickerEndTimeLabel: 'END1',
          slotPickerTime: yesterday
        })
      ]
    }));
    this.set('onDeselectSlot', sinon.stub());

    await render(hbs`<SlotsPicker::SelectionMulti @baseProps={{this.baseProps}} @onDeselectSlot={{this.onDeselectSlot}} />`);

    assert.ok(findAll('p').length, 'should render a p tag if there is a selection');
    assert.equal(find('p').textContent.trim(), 'You have chosen:', 'should contain title');

    assert.equal(findAll('div.asp-multi-selection-item').length, 2, 'should contain 2 items');
    assert.equal(this.$('div.asp-multi-selection-item').first().find('strong').text().trim(), 'LABEL1', 'should render the older slot first');

    await click('button');

    assert.ok(this.get('onDeselectSlot').called, 'should call deselect handler when button clicked');
  });
});
