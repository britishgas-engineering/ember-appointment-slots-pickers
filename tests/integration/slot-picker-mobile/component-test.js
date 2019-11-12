import { test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import { generateAppointmentSlots } from 'ember-appointment-slots-pickers/test-support/helpers/generate-appointment-slots';
import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { run } from '@ember/runloop';
import $ from 'jquery';

import { render, settled, click, findAll } from '@ember/test-helpers';

module('Integration | Component | slot-picker-mobile', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  hooks.before(function () {
    //allows to use $(element).is(:offscreen) in integration tests
    //see https://stackoverflow.com/a/8897628/4325661
    $.expr.filters.offscreen = $.expr.filters.offscreen || function (el) {
      const rect = el.getBoundingClientRect();
      const containerRect = document.querySelector('#ember-testing').getBoundingClientRect();
      return (
        (rect.x + rect.width) < containerRect.x ||
        (rect.y + rect.height) < containerRect.y ||
        (rect.x > containerRect.x + containerRect.width || rect.y > containerRect.y + containerRect.height)
      );
    };
    return true;
  });

  test('with slots available, no slot selected', async function (assert) {
    generateAppointmentSlots.call(this, {
      numberOfAppointments: 50
    });

    this.set('select', () => {});

    //this.set('appointmentSlots', appointmentSlots);
    this.set('selected', null);
    this.set('slotsAreLoading', null);

    await render(hbs`
      <div class="my-test-container" style="width:400px">
        {{#slot-picker-container
          appointmentSlots=generatedAppointmentSlots
          selected=selected
          noSlotLabel='Not available'
          select=(action select)
          as |baseProps onSelectSlot|
        }}
          {{slot-picker-mobile
            baseProps=baseProps
            onSelectSlot=onSelectSlot
          }}
        {{/slot-picker-container}}
      </div>
    `);

    assert.ok(
      this.$('.date-picker-mobile-days .scroll-header-sly-item').first().hasClass('active'),
      'when no slot is selected, center on the first available slot'
    );

    const generatedSlots = this.get('generatedAppointmentSlots');
    const firstAvailableSlot = generatedSlots.find((slot) => slot.get('available'));
    const firstDayLabel = `${firstAvailableSlot.get('startTimeLabel')} - ${firstAvailableSlot.get('endTimeLabel')}`;

    assert.notOk(
      this.$('.horizontal-swipe-view ul li:eq(0)').is(':offscreen'),
      'first column is onscreen'
    );

    assert.ok(
      this.$(`.horizontal-swipe-view ul li:eq(0) .asp-row button:contains("${firstDayLabel}")`).length,
      `first date ${firstDayLabel} is displayed in the first column`
    );

    await click('.date-picker-mobile-scroll .fa-angle-right');

    assert.notOk(
      this.$('.horizontal-swipe-view ul li:eq(1)').is(':offscreen'),
      'second column is onscreen'
    );

    this.$('.date-picker-mobile-days button:last').click();

    assert.notOk(
      this.$(`.horizontal-swipe-view ul li:eq(${generatedSlots.length - 1})`).is(':offscreen'),
      'last column is onscreen'
    );
  });

  test('single select slot', async function (assert) {
    generateAppointmentSlots.call(this, {
      numberOfAppointments: 50
    });

    const generatedSlots = this.get('generatedAppointmentSlots');
    const lastAvailableSlot = generatedSlots.filterBy('available', true).get('lastObject');

    this.actions.select = (selected) => {
      this.get('selected').clear().pushObject(selected);
    };

    this.set('selected', [lastAvailableSlot]);
    this.set('slotsAreLoading', null);

    await render(hbs`
      <div class="my-test-container" style="width:400px">
        {{#slot-picker-container
          appointmentSlots=generatedAppointmentSlots
          selected=selected
          noSlotLabel='Not available'
          select=(action 'select')
          as |baseProps onSelectSlot|
        }}
          {{slot-picker-mobile
            baseProps=baseProps
            onSelectSlot=onSelectSlot
          }}
        {{/slot-picker-container}}
      </div>
    `);

    const $lastDate = this.$('.date-picker-mobile-days .scroll-header-sly-item.active');

    assert.ok(
      findAll('.horizontal-swipe-view .asp-appointment-slot-selected').length,
      'last slot is selected'
    );
    run(() => {
      $lastDate.find('button').click();
    });
    return settled().then(() => {
      return settled();
    }).then(() => {
      assert.ok(
        $lastDate.hasClass('active'),
        'last date is still selected so active'
      );
      assert.ok(
        findAll('.horizontal-swipe-view .asp-appointment-slot-selected').length,
        'slot is still selected'
      );

      assert.equal(
        findAll('.asp-cell button').length,
        this.get('availableAppointmentSlots.length') - 1,
        'has one less buttons as there are available slots as button is still selected'
      );
    });
  });

  test('multi select slot', async function (assert) {
    generateAppointmentSlots.call(this, {
      numberOfAppointments: 50
    });

    this.actions.select = (slot) => {
      this.get('selected').pushObject(slot);
    };

    this.actions.deselect = (slot) => {
      this.get('selected').removeObject(slot);
    };

    this.set('selected', []);
    this.set('slotsAreLoading', null);

    await render(hbs`
      <div class="my-test-container" style="width:400px">
        {{#slot-picker-container
          appointmentSlots=generatedAppointmentSlots
          selected=selected
          canSelectMultipleSlots=true
          select=(action 'select')
          deselect=(action 'deselect')
          as |baseProps onSelectSlot onDeselectSlot|
        }}
          {{slot-picker-mobile
            baseProps=baseProps
            onSelectSlot=onSelectSlot
            onDeselectSlot=onDeselectSlot
          }}
        {{/slot-picker-container}}
      </div>
    `);

    // find a day with more than 1 button
    const $currentDay = this.$('.horizontal-swipe-view-item').filter((i, el) => {
      return this.$(el).find('button').length > 1;
    }).last();
    const currentDayIndex = this.$('.horizontal-swipe-view-item').index($currentDay);
    const dayButtons = $currentDay.find('button').length;
    const $lastDate = this.$('.date-picker-mobile-days .scroll-header-sly-item').eq(currentDayIndex);

    run(() => $lastDate.find('button').click());

    assert.ok(
      $lastDate.hasClass('active'),
      'last date is still selected so active'
    );

    run(() => $currentDay.find('button:first').click());

    run(() => {
      assert.ok(
        $currentDay.find('button.selected').length,
        'slot is selected'
      );

      assert.notOk(
        this.$('.horizontal-swipe-view:last .asp-appointment-slot-selected').length,
        'multi-slot picker does not get rid of button when selected'
      );

      run(() => $currentDay.find('button:last').click());

      run(() => {
        assert.equal(
          $currentDay.find('button.selected').length,
          2,
          '2 slots selected'
        );

        assert.equal(
          $currentDay.find('button').length,
          dayButtons,
          'should keep number of buttons constant'
        );

        // deselect slot
        run(() => $currentDay.find('button:first').click());

        run(() => {
          assert.equal(
            $currentDay.find('button.selected').length,
            1,
            '1 slots selected'
          );

          // change day
          this.$('.date-picker-mobile-days .scroll-header-sly-item').first();

          assert.equal(
            this.get('selected.length'),
            1,
            'changing date keeps 1 slots selected'
          );

          assert.equal(
            this.$('.horizontal-swipe-view-item:first button.selected').length,
            0,
            'no slots selected for the new day'
          );
        });
      });
    });
  });
});
