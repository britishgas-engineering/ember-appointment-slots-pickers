import layout from './template';
import { computed } from '@ember/object';
import slotPickerBase from 'ember-appointment-slots-pickers/components/slot-picker-base/component';

export default slotPickerBase.extend({
  layout,

  selectedDayIndex: computed('multiSelected.[]', 'cols.@each.dayLabel', function () {
    let selectedDayIndex;

    this.get('cols').find((col, index) => {
      // NB. col.dayLabel is undefined if appointments populated with dummy loading appointments
      const dayLabel = col.get('dayLabel');
      const multiSelected = this.get('multiSelected');

      // always scroll to the last selected column
      if (dayLabel && multiSelected.length > 0 && multiSelected[multiSelected.length - 1].get('slotPickerDayLabel') === dayLabel) {
        selectedDayIndex = index;
      }
    });

    return selectedDayIndex;
  })
});
