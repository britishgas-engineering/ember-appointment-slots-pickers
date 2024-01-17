import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';
import { render, settled, click, findAll } from '@ember/test-helpers';
import $ from 'jquery';

module('Integration | Component | slots-picker/button', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.actions = {};
    this.send = (actionName, ...args) =>
      this.actions[actionName].apply(this, args);
  });

  test('single selection with slot selected', async function (assert) {
    assert.expect(2);

    const appointmentSlots = [{ slotPickerTime: 'myTime' }];
    const appointmentSlot = appointmentSlots[0];

    this.set('appointmentSlots', appointmentSlots);
    this.set('appointmentSlot', appointmentSlot);

    this.actions.onSelectSlot = () => {
      assert.ok(false, 'onSelectSlot shouldnt be run');
    };

    await render(hbs`
      <div>
        <SlotsPicker::Button @appointmentSlot={{appointmentSlot}} @multiSelected={{appointmentSlots}} @select={{action "onSelectSlot"}} />
      </div>
    `);

    assert.ok(
      findAll('.asp-appointment-slot-selected').length,
      'has asp-appointment-slot-selected class'
    );

    assert.ok(
      $('.asp-appointment-slot-selected:contains("myTime")').length,
      'displays cell'
    );
  });

  test('multi selection with slots selected', async function (assert) {
    // assert.expect(2);

    const appointmentSlots = [
      { slotPickerTime: 'myTime' },
      { slotPickerTime: 'moreTime' },
    ];
    const appointmentSlot = appointmentSlots[0];
    this.set('onSelectSlot', sinon.stub());
    this.set('onDeselectSlot', sinon.stub());
    this.set('appointmentSlots', appointmentSlots);
    this.set('appointmentSlot', appointmentSlot);

    await render(hbs`
      <div>
        <SlotsPicker::Button @appointmentSlot={{appointmentSlot}} @multiSelected={{appointmentSlots}} @canSelectMultipleSlots={{true}} @select={{action onSelectSlot}} @deselect={{action onDeselectSlot}} />
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

    assert.ok(
      this.onDeselectSlot.called,
      'should call deselect action when button clicked'
    );
    assert.notOk(
      this.onSelectSlot.called,
      'should not call select action when button clicked'
    );
  });

  test('with slot not selected', async function (assert) {
    assert.expect(4);

    const appointmentSlot = { slotPickerTime: 'myTime' };
    const selectedSlots = [{ id: 'bla' }];

    this.set('appointmentSlot', appointmentSlot);
    this.set('selectedSlots', selectedSlots);

    this.actions.onSelectSlot = (slot) => {
      assert.strictEqual(slot, appointmentSlot, 'appointmentSlot is selected');
    };

    await render(hbs`
      <div>
        <SlotsPicker::Button @appointmentSlot={{appointmentSlot}} @multiSelected={{selectedSlots}} @select={{action "onSelectSlot"}} />
      </div>
    `);

    assert.notOk(
      findAll('.asp-appointment-slot-selected').length,
      'hasnt asp-appointment-slot-selected class'
    );

    assert.ok(
      $('.asp-btn:contains("myTime")').length,
      'displays cell inside button'
    );

    run(() => {
      $('.asp-btn:contains("myTime")').click();
    });

    return settled().then(() => {
      assert.ok(
        true,
        'action is called as per separate assertion and assert.expect'
      );
    });
  });
});
