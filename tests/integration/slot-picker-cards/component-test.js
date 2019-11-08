import {
  module} from 'qunit'; import {setupRenderingTest
} from 'ember-qunit';
import { test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import { generateAppointmentSlots } from 'dummy/tests/helpers/generate-appointment-slots';
import { run } from '@ember/runloop';
import { render, settled, findAll } from '@ember/test-helpers';

module('Integration | Component | slot-picker-cards', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('with slots available, no slot selected', async function (assert) {
    generateAppointmentSlots.call(this, {
      numberOfAppointments: 50
    });

    this.actions.select = (selected) => {
      this.get('selected').pushObject(selected);
    };

    this.set('selected', []);

    await render(hbs`
      <div>
        {{#slot-picker-container
          appointmentSlots=generatedAppointmentSlots
          select=(action 'select')
          selected=selected
          as |baseProps onSelectSlot|
        }}
          {{slot-picker-cards
            baseProps=baseProps
            onSelectSlot=onSelectSlot
          }}
        {{/slot-picker-container}}
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

    this.actions.testSelect = () => {};

    const availableAppointmentSlots = this.get('availableAppointmentSlots');
    const lastAvailableSlot = availableAppointmentSlots.get('lastObject');

    this.set('selected', [lastAvailableSlot]);

    await render(hbs`
      <div>
        {{#slot-picker-container
          appointmentSlots=generatedAppointmentSlots
          select=(action 'testSelect')
          selected=selected
          as |baseProps onSelectSlot|
        }}
          {{slot-picker-cards
            baseProps=baseProps
            onSelectSlot=onSelectSlot
          }}
        {{/slot-picker-container}}
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

    this.actions.onSelect = (slot) => this.get('selected').pushObject(slot);
    this.actions.onDeselect = (slot) => this.get('selected').removeObject(slot);

    const availableAppointmentSlots = this.get('availableAppointmentSlots');
    const lastAvailableSlot = availableAppointmentSlots.get('lastObject');

    this.set('selected', [lastAvailableSlot]);

    await render(hbs`
      <div>
        {{#slot-picker-container
          appointmentSlots=generatedAppointmentSlots
          selected=selected
          canSelectMultipleSlots=true
          select=(action 'onSelect')
          deselect=(action 'onDeselect')
          as |baseProps onSelectSlot onDeselectSlot|
        }}
          {{slot-picker-cards
            baseProps=baseProps
            onSelectSlot=onSelectSlot
            onDeselectSlot=onDeselectSlot
          }}
        {{/slot-picker-container}}
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
