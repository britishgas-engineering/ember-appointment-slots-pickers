import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, findAll, clearRender } from '@ember/test-helpers';
import EmberObject from '@ember/object';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';

module('Integration | Component | slots-filter', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
  });

  const timeSlots = [
    {
      label: '8am - 10am'
    },
    {
      label: '10am - 12pm'
    },
    {
      label: '12pm - 2pm'
    },
    {
      label: '2pm - 4pm'
    }
  ];

  test('should have a font awesome angle-down icon and hide the filter at start for mobile', async function (assert) {

    this.set('areTimeSlotsHidden', true);
    this.set('viewport', EmberObject.create({
      isXs: true
    }));
    await render(hbs`
      {{slots-filter/ui
        areTimeSlotsHidden=areTimeSlotsHidden
        viewport=viewport
      }}
    `);
    assert.equal(
      findAll('.fa.fa-angle-down').length,
      1,
      'the font awesome angle-down icon should be shown'
    );
    assert.equal(
      find('div.filter').getAttribute('hidden'),
      '',
      'the filter should be hidden'
    );

    this.set('areTimeSlotsHidden', true);
    this.set('timeSlots', timeSlots);
    await clearRender();
    await render(hbs`
      {{slots-filter/ui
        areTimeSlotsHidden=areTimeSlotsHidden
        timeSlots=timeSlots
        viewport=viewport
      }}
    `);
    await run(() => this.$('button:contains("Filter by time slots")').click());

    assert.equal(
      findAll('.filter-container-mobile').length,
      1,
      'mobile version is displayed'
    );
    assert.equal(
      findAll('.fa.fa-angle-up').length,
      1,
      'the font awesome angle-up icon should be shown'
    );
    assert.equal(
      find('div.filter').getAttribute('hidden'),
      null,
      'the filter should not be hidden'
    );
    assert.equal(
      this.$('div.filter-button-group:visible').length,
      1,
      'one group of buttons should be displayed'
    );
    assert.equal(
      findAll('button.filter-slot').length,
      5,
      'five filter slot buttons should be displayed'
    );
    assert.equal(
      this.$('button.filter-slot-big:visible').length,
      1,
      'one big filter slot button should be displayed'
    );
    assert.equal(
      this.$('button.filter-slot-selected:visible').length,
      1,
      'one selected filter slot button should be displayed'
    );
    assert.equal(
      this.$('button:contains("8am - 10am"):visible').length,
      1,
      'one "8am - 10am" filter slot button should be displayed'
    );
    assert.equal(
      this.$('button:contains("10am - 12pm"):visible').length,
      1,
      'one "10am - 12pm" filter slot button should be displayed'
    );
    assert.equal(
      this.$('button:contains("12pm - 2pm"):visible').length,
      1,
      'one "12pm - 2pm" filter slot button should be displayed'
    );
    assert.equal(
      this.$('button:contains("2pm - 4pm"):visible').length,
      1,
      'one "2pm - 4pm" filter slot button should be displayed'
    );
    assert.equal(
      this.$('button:contains("Show all"):visible').length,
      1,
      'one "Show all" filter slot button should be displayed'
    );
  });

  test('Desktop should show all the filters', async function (assert) {
    this.set('areTimeSlotsHidden', true);
    this.set('viewport', EmberObject.create({
      isXs: false
    }));
    this.set('timeSlots', timeSlots);
    await render(hbs`
      {{slots-filter/ui
        areTimeSlotsHidden=areTimeSlotsHidden
        timeSlots=timeSlots
        viewport=viewport
      }}
    `);

    assert.equal(
      this.$('div.filter-button-group:visible').length,
      1,
      'one group of buttons should be displayed'
    );
    assert.equal(
      findAll('button.filter-slot-desktop').length,
      5,
      'five filter slot buttons should be displayed'
    );
    assert.equal(
      this.$('button.filter-slot-selected:visible').length,
      1,
      'one selected filter slot button should be displayed'
    );
    assert.equal(
      this.$('button:contains("8am - 10am"):visible').length,
      1,
      'one "8am - 10am" filter slot button should be displayed'
    );
    assert.equal(
      this.$('button:contains("10am - 12pm"):visible').length,
      1,
      'one "10am - 12pm" filter slot button should be displayed'
    );
    assert.equal(
      this.$('button:contains("12pm - 2pm"):visible').length,
      1,
      'one "12pm - 2pm" filter slot button should be displayed'
    );
    assert.equal(
      this.$('button:contains("2pm - 4pm"):visible').length,
      1,
      'one "2pm - 4pm" filter slot button should be displayed'
    );
    assert.equal(
      this.$('button:contains("Show all"):visible').length,
      1,
      'one "Show all" filter slot button should be displayed'
    );
  });

  test('should hide the filter when the user clicks on a slot button', async function (assert) {
    this.set('areTimeSlotsHidden', false);
    this.set('viewport', EmberObject.create({
      isXs: true
    }));
    this.set('timeSlots', timeSlots);
    await render(hbs`
      {{slots-filter/ui
        areTimeSlotsHidden=areTimeSlotsHidden
        timeSlots=timeSlots
        viewport=viewport
      }}
    `);
    await run(() => this.$('button:contains("8am - 10am")').click());
    assert.equal(
      find('div.filter').getAttribute('hidden'),
      '',
      'the filter should be hidden'
    );
  });
});
