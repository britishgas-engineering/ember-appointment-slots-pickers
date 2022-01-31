import {
  module} from 'qunit'; import {setupRenderingTest
} from 'ember-qunit';
import { test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import { generateAppointmentSlots } from 'ember-appointment-slots-pickers/test-support/helpers/generate-appointment-slots';
import { run } from '@ember/runloop';
import { render, settled, findAll } from '@ember/test-helpers';

module('Integration | Component | slots-picker/desktop-no-category-column', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  test('with slots available, no slot selected', async function (assert) {

    generateAppointmentSlots.call(this, {
      numberOfAppointments: 50
    });
    this.set('testSelect', () => {});

    await render(hbs`
      <div>
        {{#slots-picker
          appointmentSlots=generatedAppointmentSlots
          select=(action testSelect)
          as |baseProps onSelectSlot|
        }}
          {{slots-picker/desktop-no-category-column
            baseProps=baseProps
            onSelectSlot=onSelectSlot
          }}
        {{/slots-picker}}
      </div>
    `);
   
    assert.equal(findAll('.asp-btn').length > 0, true, 'has some available appointments loaded afterwards');
    assert.equal(findAll('.asp-col-header').length > 0, false, 'should not have category column');
    assert.equal(findAll('.asp-scroll-btn-prev').length > 0, false, 'does not have previous button as shows the first appointments');
    assert.dom('.asp-col-header .asp-row.delimiter').doesNotExist('has no delimiter in the header column');
    assert.equal(
      findAll('.asp-scroll .asp-col:eq(0) .asp-row.delimiter').length,
      0,
      'has no delimiter in the first non-header column'
    );

    assert.equal(findAll('.asp-row.asp-row-header.background-dark-blue').length > 0, true, 'default Brand background color has been applied');
    assert.equal(
      findAll('.asp-cell button').length,
      this.get('availableAppointmentSlots.length'),
      'has as many buttons as there are available slots');
  });

  test('with slots available, last slot selected', async function (assert) {

    generateAppointmentSlots.call(this, {
      numberOfAppointments: 50
    });
    this.actions.testSelect = () => {};
    const generatedAppointmentSlots = this.generatedAppointmentSlots;
    const selectedSlot = generatedAppointmentSlots[generatedAppointmentSlots.length - 1];
    let availableAppointmentSlots;
    run(() => {
      selectedSlot.set('available', false);
      availableAppointmentSlots = generatedAppointmentSlots.filterBy('available', true);
    });
    this.set('selected', selectedSlot);
    await render(hbs`
      <div>
        {{#slots-picker
          appointmentSlots=generatedAppointmentSlots
          select=(action 'testSelect')
          selected=selected
          as |baseProps onSelectSlot|
        }}
          {{slots-picker/desktop-no-category-column
            baseProps=baseProps
            onSelectSlot=onSelectSlot
          }}
        {{/slots-picker}}
      </div>
    `);
    return settled().then(() => {

      assert.equal(findAll('.asp-btn').length > 0, true, 'has some available appointments loaded afterwards');
      assert.equal(findAll('.asp-scroll-btn-prev').length > 0, true, 'has previous button');
      assert.equal(findAll('.asp-scroll-btn-next').length > 0, false, 'does not have next button as shows the last appointments');

      assert.equal(findAll('.asp-row.asp-row-header.background-dark-blue').length > 0, true, 'default Brand background color has been applied');
      assert.equal(
        findAll('.asp-cell button').length,
        availableAppointmentSlots.get('length'),
        'has as many buttons as there are available slots');
    });
  });
});
