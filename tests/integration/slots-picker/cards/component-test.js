import {
  module} from 'qunit'; import {setupRenderingTest
} from 'ember-qunit';
import { test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import { generateAppointmentSlots } from 'ember-appointment-slots-pickers/test-support/helpers/generate-appointment-slots';
import { run } from '@ember/runloop';
import { render, settled, findAll } from '@ember/test-helpers';

module('Integration | Component | slot-picker-cards', function (hooks) {
  setupRenderingTest(hooks);

  test('with slots available, no slot selected', async function (assert) {
    generateAppointmentSlots.call(this, {
      numberOfAppointments: 50
    });

    this.set('select', (selected) => {
      this.get('selected').pushObject(selected);
    });

    this.set('selected', []);

    await render(hbs`
      <div>
        <SlotsPicker
          @appointmentSlots={{this.generatedAppointmentSlots}}
          @select={{action this.select}}
          @selected={{this.selected}}
          as |baseProps onSelectSlot|
        >
          <SlotsPicker::Cards
            @baseProps={{baseProps}}
            @onSelectSlot={{onSelectSlot}}
          />
        </SlotsPicker>
      </div>
    `);

    assert.equal(findAll('.asp-btn').length > 0, true, 'has some available appointments loaded afterwards');

    const nbButtons = this.get('availableAppointmentSlots.length');

    assert.equal(
      findAll('.asp-btn').length,
      nbButtons,
      `has as many buttons as there are available slots (${nbButtons})`
    );

    const slotPickerTime = this.get('slotsOfDate1.firstObject.slotPickerTime');

    run(() => {
      this.$(`.asp-btn:contains("${slotPickerTime}"):first`).click();
    });

    return settled().then(() => {
      assert.equal(
        this.$(`.asp-appointment-slot-selected:contains("${slotPickerTime}")`).length,
        1,
        'timeslot is selected.'
      );
    });
  });

  test('with slots available, last slot selected', async function (assert) {
    generateAppointmentSlots.call(this, {
      numberOfAppointments: 50
    });

    this.set('testSelect', () => {});

    const availableAppointmentSlots = this.get('availableAppointmentSlots');
    const lastAvailableSlot = availableAppointmentSlots.get('lastObject');

    this.set('selected', [lastAvailableSlot]);

    await render(hbs`
      <div>
        <SlotsPicker
          @appointmentSlots={{this.generatedAppointmentSlots}}
          @select={{action this.testSelect}}
          @selected={{this.selected}}
          as |baseProps onSelectSlot|
        >
          <SlotsPicker::Cards
            @baseProps={{baseProps}}
            @onSelectSlot={{onSelectSlot}}
          />
        </SlotsPicker>
      </div>
    `);

    return settled().then(() => {
      assert.equal(findAll('.asp-btn').length > 0, true, 'has some available appointments loaded afterwards');

      assert.equal(
        findAll('.slot-picker-button').length,
        availableAppointmentSlots.get('length'),
        'has as many buttons as there are available slots'
      );

      assert.ok(
        findAll('.slot-picker-button .asp-appointment-slot-selected').length,
        'last slot is selected'
      );
    });
  });

  test('multiple selections', async function (assert) {
    generateAppointmentSlots.call(this, {
      numberOfAppointments: 50
    });

    this.set('onSelect', (slot) => this.get('selected').pushObject(slot));
    this.set('onDeselect', (slot) => this.get('selected').removeObject(slot));

    const availableAppointmentSlots = this.get('availableAppointmentSlots');
    const lastAvailableSlot = availableAppointmentSlots.get('lastObject');

    this.set('selected', [lastAvailableSlot]);

    await render(hbs`
      <div>
        <SlotsPicker
          @appointmentSlots={{this.generatedAppointmentSlots}}
          @selected={{this.selected}}
          @select={{action this.onSelect}}
          @deselect={{action this.onDeselect}}
          @canSelectMultipleSlots={{true}}
          as |baseProps onSelectSlot onDeselectSlot|
        >
          <SlotsPicker::Cards
            @baseProps={{baseProps}}
            @onSelectSlot={{onSelectSlot}}
            @onDeselectSlot={{onDeselectSlot}}
          />
        </SlotsPicker>
      </div>
    `);

    const $cardWithButtons = this.$('.five-cards').filter((i, el) => {
      return this.$(el).find('.slot-picker-button').length > 1;
    }).first();

    await run(() => $cardWithButtons.find('.slot-picker-button:first button').click());

    assert.notOk(
      $cardWithButtons.find('.slot-picker-button .asp-appointment-slot-selected').length,
      'should not remove buttons when selecting'
    );

    assert.equal(
      $cardWithButtons.find('.slot-picker-button button.selected').length,
      1,
      'should select one slot'
    );

    $cardWithButtons.find('.slot-picker-button:last button').click();

    assert.equal(
      $cardWithButtons.find('.slot-picker-button button.selected').length,
      2,
      'should select two slots'
    );

    $cardWithButtons.find('.slot-picker-button:first button').click();

    assert.equal(
      $cardWithButtons.find('.slot-picker-button button.selected').length,
      1,
      'should deselect one slot'
    );
  });
});
