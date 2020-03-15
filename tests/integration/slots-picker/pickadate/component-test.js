import { test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object';
import { generateAppointmentSlots } from 'ember-appointment-slots-pickers/test-support/helpers/generate-appointment-slots';
import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { run } from '@ember/runloop';
import moment from 'moment';

import {
  render,
  settled,
  find,
  click,
  findAll
} from '@ember/test-helpers';

module('Integration | Component | slots-picker/pickadate', function (hooks) {
  setupRenderingTest(hooks);

  test('displays available appointment days and time slots.', async function (assert) {
    generateAppointmentSlots.call(this, {
      numberOfAppointments: 50
    });
    const firstAvailableDay = this.get('firstAvailableDay');
    const secondAvailableDay = this.get('secondAvailableDay');
    const slotsOfDate1 = this.get('slotsOfDate1');
    const availableDaysOfFirstMonth = this.get('availableDaysOfFirstMonth');
    this.set('select', (selected) => {
      this.set('selected', selected);
    });
    this.set('noSlotLabel', 'Fully booked');
    //this.set('appointmentSlots', appointmentSlots);
    this.set('selected', null);
    await render(hbs`
      <div class="my-test-container" style="width:400px">
        <SlotsPicker
          @appointmentSlots={{this.generatedAppointmentSlots}}
          @noSlotLabel={{this.noSlotLabel}}
          @select={{action this.select}}
          @selected={{this.selected}}
          as |baseProps onSelectSlot onSelectDate|
        >
          <SlotsPicker::Pickadate
            @baseProps={{baseProps}}
            @onSelectSlot={{onSelectSlot}}
            @onSelectDate={{onSelectDate}}
          />
        </SlotsPicker>
      </div>
    `);
    //I have no clue why or when the calendar starts at the second page instead of the first one
    //that's standard behaviour of pickadate apparently
    await click('.picker__nav--prev');
    assert.equal(
      this.$('.picker__day--infocus:not(".picker__day--disabled")').length,
      availableDaysOfFirstMonth.get('length'),
      'expect as many days with appointments as from stub data.'
    );

    assert.equal(
      this.$('h3:contains("Great, now pick your time slot")').length,
      0,
      'Should not have appointment times until a day is clicked.'
    );

    run(() => {
      this.$('div:contains(' + firstAvailableDay + ')').click();
    });

    return settled().then(() => {
      assert.equal(
        find('.picker__day--highlighted').textContent.trim(),
        firstAvailableDay,
        'Date clicked should be highlighted.'
      );

      assert.equal(
        this.$('h3:contains("Great, now pick your time slot")').length,
        1,
        'Clicking an appointment day should reveal appointment times.'
      );
      assert.equal(
        this.$('.no-slot-label:contains("Fully booked")').length,
        5 - slotsOfDate1.get('length'),
        'None available time slots should resolve to passed property (Fully booked)'
      );

      this.set('noSlotLabel', 'no slot test copy');

      assert.equal(
        this.$('.no-slot-label:contains("Fully booked")').length,
        0,
        'Fully booked default text has been replaced.'
      );

      assert.equal(
        this.$('.no-slot-label:contains("no slot test copy")').length,
        5 - slotsOfDate1.get('length'),
        'None available time slots displays noSlotLabel passed in as an attribute.'
      );

      assert.equal(
        findAll('.asp-appointment-slot-selected').length,
        0,
        'No timeslot selected as timeslot has not yet been picked.'
      );
      const slotPickerTime = slotsOfDate1.get('firstObject.slotPickerTime');
      run(() => {
        this.$(`.asp-btn:contains("${slotPickerTime}")`).click();
      });
      return settled().then(() => {
        assert.equal(
          this.$(`.asp-appointment-slot-selected:contains("${slotPickerTime}")`).length,
          1,
          'timeslot is selected.'
        );

        run(() => {
          this.$('div:contains(' + secondAvailableDay + ')').click();
        });
        return settled();
      }).then(() => {
        assert.equal(
          findAll('.asp-appointment-slot-selected').length,
          0,
          'No timeslot selected as selected timeslot has been nulled by date change.'
        );
      });

    });
  });

  test('scrolling behaviour', async function (assert) {
    generateAppointmentSlots.call(this, {
      numberOfAppointments: 50
    });
    const availableAppointmentSlots = this.get('availableAppointmentSlots');
    const firstSlot = moment(availableAppointmentSlots[0].get('slotPickerDay'));
    this.set('select', (selected) => {
      this.set('selected', selected);
    });
    this.set('noSlotLabel', 'Fully booked');
    //this.set('appointmentSlots', appointmentSlots);
    this.set('selected', firstSlot);
    const scrollToStub = sinon.stub();
    this.set('scroll', {
      to: scrollToStub
    });
    await render(hbs`
      <div class="my-test-container" style="width:400px">
        <SlotsPicker
          @appointmentSlots={{this.generatedAppointmentSlots}}
          @noSlotLabel={{this.noSlotLabel}}
          @select={{action this.select}}
          @selected={{this.selected}}
          as |baseProps onSelectSlot onSelectDate|
        >
          <SlotsPicker::Pickadate
            @baseProps={{baseProps}}
            @onSelectSlot={{onSelectSlot}}
            @onSelectDate={{onSelectDate}}
            @scroll={{scroll}}
          />
        </SlotsPicker>
      </div>
    `);
    assert.notOk(scrollToStub.called, 'not scrolling on editing journey initially');
    run(() => {
      this.$('.picker__day:not(.picker__day--disabled)').eq(0).click();
    });
    return settled().then(() => {
      assert.ok(scrollToStub.called, 'scrolling after selecting a date');
    });
  });

  test('combine with slot-picker-filter', async function (assert) {
    generateAppointmentSlots.call(this, {
      numberOfAppointments: 50
    });
    const availableAppointmentSlots = this.get('availableAppointmentSlots');
    const firstSlot = moment(availableAppointmentSlots[0].get('slotPickerDay'));
    this.set('select', (selected) => {
      this.set('selected', selected);
    });
    this.set('noSlotLabel', 'Fully booked');
    //this.set('appointmentSlots', appointmentSlots);
    this.set('selected', firstSlot);
    const scrollToStub = sinon.stub();
    this.set('scroll', {
      to: scrollToStub
    });
    this.set('viewport', EmberObject.create({
      isXs: true
    }));
    await render(hbs`
      <div class="my-test-container" style="width:400px">
        <SlotsFilter
          @appointmentSlots={{this.generatedAppointmentSlots}}
          as |filteredAppointmentSlots changeFilter selectedFilter|
        >
          <SlotsPicker
            @appointmentSlots={{filteredAppointmentSlots}}
            @noSlotLabel={{this.noSlotLabel}}
            @select={{action this.select}}
            @selected={{this.selected}}
            @selectedFilter={{selectedFilter}}
            as |baseProps onSelectSlot onSelectDate|
          >
            <SlotsFilter::Ui
              @timeSlots={{baseProps.rows}}
              @changeFilter={{changeFilter}}
              @selectedFilter={{selectedFilter}}
              @viewport={{this.viewport}}
            />
            <SlotsPicker::Pickadate
              @baseProps={{baseProps}}
              @onSelectSlot={{onSelectSlot}}
              @onSelectDate={{onSelectDate}}
              scroll={{scroll}}
            />
          </SlotsPicker>
        </SlotsFilter>
      </div>
    `);
    await run(() => {
      this.$('.picker__day:not(.picker__day--disabled)').eq(0).click();
    });
    assert.ok(
      this.$('h3:contains("Great, now pick your time slot")').length,
      'Should have appointment times when no filter is selected'
    );
    await click('.filter-container button');
    await click(find('.filter-container .filter button'));
    await run(() => {
      this.$('.picker__day:not(.picker__day--disabled)').eq(0).click();
    });
    assert.notOk(
      this.$('h3:contains("Great, now pick your time slot")').length,
      'Should not have appointment times when filter is selected'
    );
    await click('.filter-container button');
    await run(() => {
      this.$('.filter-container .filter button:contains(Show all)').click();
    });
    await run(() => {
      this.$('.picker__day:not(.picker__day--disabled)').eq(0).click();
    });
    assert.ok(
      this.$('h3:contains("Great, now pick your time slot")').length,
      'Should have appointment times when filter is "Show all"'
    );
  });
});
