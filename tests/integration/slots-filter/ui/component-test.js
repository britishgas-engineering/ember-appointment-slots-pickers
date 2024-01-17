import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, findAll, clearRender } from '@ember/test-helpers';
import EmberObject from '@ember/object';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';
import $ from 'jquery';

module('Integration | Component | slots-filter', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {});

  const timeSlots = [
    {
      label: '8am - 10am',
    },
    {
      label: '10am - 12pm',
    },
    {
      label: '12pm - 2pm',
    },
    {
      label: '2pm - 4pm',
    },
  ];

  test('should have a font awesome angle-down icon and hide the filter at start for mobile', async function (assert) {
    this.set('areTimeSlotsHidden', true);
    this.set(
      'viewport',
      EmberObject.create({
        isXs: true,
      })
    );
    await render(hbs`
      <SlotsFilter::Ui @areTimeSlotsHidden={{areTimeSlotsHidden}} @viewport={{viewport}} />
    `);
    assert
      .dom('.fa.fa-angle-down')
      .exists({ count: 1 }, 'the font awesome angle-down icon should be shown');
    assert
      .dom('div.filter')
      .hasAttribute('hidden', '', 'the filter should be hidden');

    this.set('areTimeSlotsHidden', true);
    this.set('timeSlots', timeSlots);
    await clearRender();
    await render(hbs`
      <SlotsFilter::Ui @areTimeSlotsHidden={{areTimeSlotsHidden}} @timeSlots={{timeSlots}} @viewport={{viewport}} />
    `);
    await run(() => $('button:contains("Filter by time slots")').click());

    assert
      .dom('.filter-container-mobile')
      .exists({ count: 1 }, 'mobile version is displayed');
    assert
      .dom('.fa.fa-angle-up')
      .exists({ count: 1 }, 'the font awesome angle-up icon should be shown');
    assert
      .dom('div.filter')
      .hasAttribute('hidden', null, 'the filter should not be hidden');
    assert.strictEqual(
      $('div.filter-button-group:visible').length,
      1,
      'one group of buttons should be displayed'
    );
    assert
      .dom('button.filter-slot')
      .exists({ count: 5 }, 'five filter slot buttons should be displayed');
    assert.strictEqual(
      $('button.filter-slot-big:visible').length,
      1,
      'one big filter slot button should be displayed'
    );
    assert.strictEqual(
      $('button.filter-slot-selected:visible').length,
      1,
      'one selected filter slot button should be displayed'
    );
    assert.strictEqual(
      $('button:contains("8am - 10am"):visible').length,
      1,
      'one "8am - 10am" filter slot button should be displayed'
    );
    assert.strictEqual(
      $('button:contains("10am - 12pm"):visible').length,
      1,
      'one "10am - 12pm" filter slot button should be displayed'
    );
    assert.strictEqual(
      $('button:contains("12pm - 2pm"):visible').length,
      1,
      'one "12pm - 2pm" filter slot button should be displayed'
    );
    assert.strictEqual(
      $('button:contains("2pm - 4pm"):visible').length,
      1,
      'one "2pm - 4pm" filter slot button should be displayed'
    );
    assert.strictEqual(
      $('button:contains("Show all"):visible').length,
      1,
      'one "Show all" filter slot button should be displayed'
    );
  });

  test('Desktop should show all the filters', async function (assert) {
    this.set('areTimeSlotsHidden', true);
    this.set(
      'viewport',
      EmberObject.create({
        isXs: false,
      })
    );
    this.set('timeSlots', timeSlots);
    await render(hbs`
      <SlotsFilter::Ui @areTimeSlotsHidden={{areTimeSlotsHidden}} @timeSlots={{timeSlots}} @viewport={{viewport}} />
    `);

    assert.strictEqual(
      $('div.filter-button-group:visible').length,
      1,
      'one group of buttons should be displayed'
    );
    assert
      .dom('button.filter-slot-desktop')
      .exists({ count: 5 }, 'five filter slot buttons should be displayed');
    assert.strictEqual(
      $('button.filter-slot-selected:visible').length,
      1,
      'one selected filter slot button should be displayed'
    );
    assert.strictEqual(
      $('button:contains("8am - 10am"):visible').length,
      1,
      'one "8am - 10am" filter slot button should be displayed'
    );
    assert.strictEqual(
      $('button:contains("10am - 12pm"):visible').length,
      1,
      'one "10am - 12pm" filter slot button should be displayed'
    );
    assert.strictEqual(
      $('button:contains("12pm - 2pm"):visible').length,
      1,
      'one "12pm - 2pm" filter slot button should be displayed'
    );
    assert.strictEqual(
      $('button:contains("2pm - 4pm"):visible').length,
      1,
      'one "2pm - 4pm" filter slot button should be displayed'
    );
    assert.strictEqual(
      $('button:contains("Show all"):visible').length,
      1,
      'one "Show all" filter slot button should be displayed'
    );
  });

  test('should hide the filter when the user clicks on a slot button', async function (assert) {
    this.set('areTimeSlotsHidden', false);
    this.set(
      'viewport',
      EmberObject.create({
        isXs: true,
      })
    );
    this.set('timeSlots', timeSlots);
    await render(hbs`
      <SlotsFilter::Ui @areTimeSlotsHidden={{areTimeSlotsHidden}} @timeSlots={{timeSlots}} @viewport={{viewport}} />
    `);
    await run(() => $('button:contains("8am - 10am")').click());
    assert
      .dom('div.filter')
      .hasAttribute('hidden', '', 'the filter should be hidden');
  });
});
