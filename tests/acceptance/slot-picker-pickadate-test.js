import {visit} from '@ember/test-helpers';
import {module, test} from 'qunit';
import $ from 'jquery';
import {setupApplicationTest} from 'ember-qunit';
import {throwsAdapterError} from 'ember-appointment-slots-pickers/test-support/helpers/throws-adapter-error';
import {run} from '@ember/runloop';

module('Acceptance | Component | slot-picker/pickadate', function (hooks) {
  setupApplicationTest(hooks);

  test('regression test slot-picker/pickadate', async function (assert) {
    //this test is needed, because there are some possible tricky discrepancies in calendars, depending on the cases
    await throwsAdapterError(assert, async () => {
      await visit('demo/slot-pickers/pickadate?delay=10');
    });
    await run(() => $('button:contains("Refresh")').click());
    const arrayOfCalendars = $('.asp-pickadate');
    const firstCalendar = arrayOfCalendars.first();
    const nbOfPrevArrows = firstCalendar.find('.picker__day--prev').length;
    const nbOfNextArrows = firstCalendar.find('.picker__day--next').length;
    const nbOfDisabledSlots = firstCalendar.find('.picker__day--disabled').length;
    const nbOfInFocusSlots = firstCalendar.find('.picker__day--infocus:not(.picker__day--disabled)').length;
    const nbOfOutFocusSlots = firstCalendar.find('.picker__day--outfocus:not(.picker__day--disabled)').length;
    const valueOfSelected = firstCalendar.find('.picker__day--selected:not(.picker__day--disabled)').text();
    const arrayOfOtherCalendars = arrayOfCalendars.toArray().slice(1);
    $.each(arrayOfOtherCalendars, function (i) {
      const j = i + 2;
      assert.equal($(this).find('.picker__day--prev').length, nbOfPrevArrows, `nbOfPrevArrows of calendar ${j} equal to ${nbOfPrevArrows}`);
      assert.equal($(this).find('.picker__day--next').length, nbOfNextArrows, `nbOfNextArrows of calendar ${j} equal to ${nbOfNextArrows}`);
      assert.equal($(this).find('.picker__day--disabled').length, nbOfDisabledSlots, `nbOfDisabledSlots of calendar ${j} equal to ${nbOfDisabledSlots}`);
      assert.equal($(this).find('.picker__day--infocus:not(.picker__day--disabled)').length, nbOfInFocusSlots, `nbOfInFocusSlots of calendar ${j} equal to ${nbOfInFocusSlots}`);
      assert.equal($(this).find('.picker__day--outfocus:not(.picker__day--disabled)').length, nbOfOutFocusSlots, `nbOfOutFocusSlots of calendar ${j} equal to ${nbOfOutFocusSlots}`);
      assert.equal($(this).find('.picker__day--selected:not(.picker__day--disabled)').text(), valueOfSelected, `valueOfSelected of calendar ${j} equal to ${valueOfSelected}`);
    });
  });
});
