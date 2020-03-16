import {
  module} from 'qunit'; import {setupRenderingTest
} from 'ember-qunit';
import { test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';
import { render, settled, click, findAll } from '@ember/test-helpers';

module('Integration | Component | slots-picker/button', function (hooks) {
  setupRenderingTest(hooks);

  test('single selection with slot selected', async function (assert) {
    assert.expect(2);

    const appointmentSlots = [{slotPickerTime: 'myTime'}];
    const appointmentSlot = appointmentSlots[0];

    this.set('appointmentSlots', appointmentSlots);
    this.set('appointmentSlot', appointmentSlot);

    this.set('onSelectSlot', () => {
      assert.ok(false, 'onSelectSlot shouldnt be run');
    });

    await render(hbs`
      <div>
        <SlotsPicker::Button
          @appointmentSlot={{this.appointmentSlot}}
          @multiSelected={{this.appointmentSlots}}
          @select={{action this.onSelectSlot}}
        />
      </div>
    `);
    assert.ok(
      findAll('.asp-appointment-slot-selected').length,
      'has asp-appointment-slot-selected class'
    );

    assert.ok(
      this.$('.asp-appointment-slot-selected:contains("myTime")').length,
      'displays cell'
    );
  });

  test('multi selection with slots selected', async function (assert) {

    const appointmentSlots = [
      {slotPickerTime: 'myTime'},
      {slotPickerTime: 'moreTime'}
    ];
    const appointmentSlot = appointmentSlots[0];
    this.set('onSelectSlot', sinon.stub());
    this.set('onDeselectSlot', sinon.stub());
    this.set('appointmentSlots', appointmentSlots);
    this.set('appointmentSlot', appointmentSlot);

    await render(hbs`
      <div>
        <SlotsPicker::Button
          @appointmentSlot={{this.appointmentSlot}}
          @multiSelected={{this.appointmentSlots}}
          @canSelectMultipleSlots={{true}}
          @select={{action this.onSelectSlot}}
          @deselect={{action this.onDeselectSlot}}
        />
      </div>
    `);

    assert.notOk(
      findAll('.asp-appointment-slot-selected').length,
      'should not display selection cell'
    );

    assert.ok(
      findAll('.asp-btn.selected').length,
      'should display deselection button'
    );

    await click('.asp-btn');

    assert.ok(this.get('onDeselectSlot').called, 'should call deselect action when button clicked');
    assert.notOk(this.get('onSelectSlot').called, 'should not call select action when button clicked');
  });

  test('with slot not selected', async function (assert) {
    assert.expect(4);

    const appointmentSlot = {slotPickerTime: 'myTime'};
    const selectedSlots = [{id: 'bla'}];

    this.set('appointmentSlot', appointmentSlot);
    this.set('selectedSlots', selectedSlots);

    this.set('onSelectSlot', (slot) => {
      assert.equal(slot, appointmentSlot, 'appointmentSlot is selected');
    });

    await render(hbs`
      <div>
        <SlotsPicker::Button
          @appointmentSlot={{this.appointmentSlot}}
          @multiSelected={{this.selectedSlots}}
          @select={{action this.onSelectSlot}}
        />
      </div>
    `);

    assert.notOk(
      findAll('.asp-appointment-slot-selected').length,
      'hasnt asp-appointment-slot-selected class'
    );

    assert.ok(
      this.$('.asp-btn:contains("myTime")').length,
      'displays cell inside button'
    );

    run(() => {
      this.$('.asp-btn:contains("myTime")').click();
    });

    return settled().then(() => {
      assert.ok(
        true,
        'action is called as per separate assertion and assert.expect'
      );
    });
  });
});
