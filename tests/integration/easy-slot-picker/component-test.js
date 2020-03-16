import {module, test} from 'qunit';
import {setupRenderingTest} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { generateAppointmentSlots } from 'ember-appointment-slots-pickers/test-support/helpers/generate-appointment-slots';

import {render, settled, findAll} from '@ember/test-helpers';

module('Integration | Component | easy-slot-picker', function (hooks) {
  setupRenderingTest(hooks);

  test('should bind appointment slots to component and not scroll', async function (assert) {
    assert.expect(6);
    // Generate no appointments first to simulate loading
    generateAppointmentSlots.call(this, {
      numberOfAppointments: 0
    });

    // Test component is not there now to prove it will be added later
    //assert.equal(this.$('.appointment-slot-picker').length === 1, false, 'has not yet rendered');

    // Render the component //NB. set width to replicate small desktop screens scroll bug #2342
    await render(hbs`
      <div>
        <EasySlotPicker @appointmentSlots={{this.generatedAppointmentSlots}} />
      </div>
    `);

    // Test the component is there but with no appointments
    assert.equal(findAll('.appointment-slot-picker').length === 1, true, 'should render component');
    assert.equal(findAll('.asp-btn').length > 0, false, 'has no available appointments');

    return settled().then(() => {
      //Generate appointments after the component has rendered
      generateAppointmentSlots.call(this, {
        numberOfAppointments: 50
      });

      // Test that there are now appointments
      assert.equal(findAll('.asp-btn').length > 0, true, 'has some available appointments loaded afterwards');

      // Test fixed bug where was scrolling past first appointments for small desktop screens #2342
      assert.equal(findAll('.asp-scroll-btn-prev').length > 0, false, 'does not have previous button as shows the first appointments');

      // test for brand (cyan0 0class has been added for background-color, for britishgas
      assert.equal(findAll('.asp-row.asp-row-header.background-dark-blue').length > 0, true, 'default Brand background color has been applied');
      assert.equal(
        findAll('.asp-cell button').length,
        this.get('availableAppointmentSlots.length'),
        'has as many buttons as there are available slots');
    });
  });

  test('should show mobile calendar if slotPickerComponentName is slots-picker/mobile', async function (assert) {
    this.set('slotPickerComponentName', 'slots-picker/mobile');
    generateAppointmentSlots.call(this, {
      numberOfAppointments: 10
    });
    await render(hbs`
      <div style="width:460px">
        <EasySlotPicker
          @slotPickerComponentName={{this.slotPickerComponentName}}
          @appointmentSlots={{this.generatedAppointmentSlots}}
        />
      </div>
    `);
    assert.equal(
      findAll('.date-picker-mobile').length,
      1,
      'mobile calendar version has rendered as isLimitedAvailability is true and showSmartCalendar is false.'
    );
  });
});
