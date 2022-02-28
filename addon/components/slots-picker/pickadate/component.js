import { bool, map } from '@ember/object/computed';
import layout from './template';
import slotPickerBase from 'ember-appointment-slots-pickers/components/slots-picker/base/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import moment from 'moment';
import { run } from '@ember/runloop';

export default slotPickerBase.extend({
  scroll: service(),
  layout,
  selectedDayOnInit: null,
  currentDay: computed('selected', 'cols', function () {
    const selectedSlot = this.selected;

    if (selectedSlot) {
      return moment(selectedSlot.get('slotPickerDay')).valueOf();
    }

    return null;
  }),

  editingExistingAppointment: bool('selectedDayOnInit'),

  // pickadate is not compatible with multiselect
  selected: computed('multiSelected.[]', function () {
    const multiSelected = this.multiSelected;

    return multiSelected ? multiSelected[0] : null;
  }),

  jsDays: map('days', function (day) {
    return moment(day).toDate();
  }),

  min: computed('jsDays.firstObject', function () {
    const firstDay = this.get('jsDays.firstObject');
    if (!firstDay) {
      return false;
    }
    return [
      firstDay.getFullYear(),
      firstDay.getMonth(),
      firstDay.getDate()
    ];
  }),

  max: computed('jsDays.lastObject', function () {
    const lastDay = this.get('jsDays.lastObject');
    if (!lastDay) {
      return false;
    }
    return [
      lastDay.getFullYear(),
      lastDay.getMonth(),
      lastDay.getDate()
    ];
  }),

  cellsForColOfSelectedDay: computed('currentDay', 'cellsPerCol.@each.col', function () {
    const currentDay = this.currentDay;

    if (!currentDay) {
      return null;
    }

    const item = this.cellsPerCol.find((item) => {
      // NB. col.dayId is undefined if appointments populated with dummy loading appointments (?)
      const dayId = item.col.dayId;

      return dayId && moment(dayId).isSame(currentDay, 'date');
    });

    return item && item.cellsForCol;
  }),

  _scrollToSlotsOnlyIfNotOnInit() {
    run.next(() => {
      if (this.isDestroyed) {
        return false;
      }
      const selectedDay = this.selectedDay;
      const selectedDayOnInit = this.selectedDayOnInit;
      const editingExistingAppointment = this.editingExistingAppointment;
      //action run on init by pickadate-input :(
      const actionIsBeingRunOnInitOnExistingAppointment =
        editingExistingAppointment &&
        (selectedDay === selectedDayOnInit);
      if (!actionIsBeingRunOnInitOnExistingAppointment) {
        this.scroll.to('time-slots');
      }
      return true;
    });
  },

  actions: {
    onSelectDate(date) {
      if (date !== this.currentDay) {
        this._scrollToSlotsOnlyIfNotOnInit();

        // select date here
        this.set('currentDay', date);

        // unselect slot - assumes non-multi-slot only
        this.onSelectSlot(null);

        this.send('onDateChange', date);
      }
    }
  }
});
