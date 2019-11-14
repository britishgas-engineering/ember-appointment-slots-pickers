import {
  filterBy,
  equal,
  or,
  union,
  mapBy,
  uniq,
  map,
  sort,
  setDiff
} from '@ember/object/computed';
import EmberObject, { computed } from '@ember/object';
import ObjectProxy from '@ember/object/proxy';
import ArrayProxy from '@ember/array/proxy';
import Component from '@ember/component';
import moment from 'moment';
import layout from './template';

export default Component.extend({
  layout,
  init() {
    this._super(...arguments);
    this.appointmentSlots = this.appointmentSlots || [];
  },
  selected: null,
  select: null,
  noSlotLabel: 'Fully booked',
  selectedFilter: null, //handle slot-picker-filter case, TODO maybe move related code to mixin??

  multiSelected: computed('selected', 'selected.[]', function () {
    const selected = this.get('selected');
    let multiSelected = [];

    if (selected instanceof ArrayProxy) {
      multiSelected = selected.toArray();
    } else if (selected instanceof Array) {
      multiSelected = selected;
    } else if (selected && (!(selected instanceof ObjectProxy) || selected.content)) {
      multiSelected = [selected];
    }

    // ensure that all selections are not proxies (from models)
    return multiSelected.map((selection) => {
      return selection instanceof ObjectProxy ? selection.content : selection;
    });
  }),

  availableAppointmentSlotsWithoutSelected: filterBy('appointmentSlots', 'slotPickerAvailable', true),
  hasNoSlots: equal('availableAppointmentSlotsWithoutSelected.length', 0),
  slotsArePending: computed('appointmentSlots.isPending', function () {
    return this.get('appointmentSlots.isPending');
  }).readOnly(),
  slotsAreLoading: or('slotsArePending', 'hasNoSlots'),

  availableSelectedSlots: computed('slotsAreLoading', function () {
    //'multiSelected' is not a cached property because we dont want to refresh the slots
    //when selecting a new slot (it would re-render everything and break slot-picker-mobile at least)
    const availableSelectedSlots = [];
    const selected = this.get('multiSelected');
    const slotsAreLoading = this.get('slotsAreLoading');

    if (!slotsAreLoading && selected.length) {
      availableSelectedSlots.push(...selected);
    }

    return availableSelectedSlots;
  }),

  //making sure the selected slot is added back to the available slots, if needed
  availableAppointmentSlots: union('availableAppointmentSlotsWithoutSelected', 'availableSelectedSlots'),
  rowIdsWithDuplicates: mapBy('availableAppointmentSlots', 'slotPickerRowId'),
  rowIds: uniq('rowIdsWithDuplicates'),

  rowsNotSorted: map('rowIds', function (id) {
    const appointmentSlots = this.get('availableAppointmentSlots');
    const appointmentSlot = appointmentSlots.findBy('slotPickerRowId', id);
    const label = appointmentSlot.get('slotPickerRowLabel') || id;
    const labelClassName = appointmentSlot.get('slotPickerRowLabelClassName');
    const group = appointmentSlot.get('slotPickerGroup') || '';
    return EmberObject.create({
      id,
      label,
      labelClassName,
      group
    });
  }),

  rowsSorting: ['group:desc', 'id:asc'],//eslint-disable-line
  rows: sort('rowsNotSorted', 'rowsSorting'),

  dayIdsWithDuplicates: mapBy('availableAppointmentSlots', 'slotPickerDay'),
  dayIds: uniq('dayIdsWithDuplicates'),

  colsNotSorted: computed('dayIds', 'availableAppointmentSlots.@each', function () {
    const appointmentSlots = this.get('availableAppointmentSlots');
    return this.get('dayIds').map((dayId) => {
      const appointmentSlotsForCol = appointmentSlots.filterBy('slotPickerDay', dayId);
      const dayLabel = appointmentSlotsForCol.get('firstObject.slotPickerDayLabel');
      return EmberObject.create({
        dayId,
        dayLabel,
        appointmentSlotsForCol
      });
    });
  }),

  colsSorting: ['dayId:asc'],//eslint-disable-line
  cols: sort('colsNotSorted', 'colsSorting'),

  cellsPerCol: computed(
    'rows.[]',
    'cols.@each.appointmentSlotsForCol',
    function () {
      return this.get('cols').map((col) => {
        const appointmentSlotsForCol = col.get('appointmentSlotsForCol');
        const cellsForCol = this.get('rows').map((row) => {
          const rowId = row.get('id');
          const appointmentSlot = appointmentSlotsForCol.findBy('slotPickerRowId', rowId);
          //set the "slotPickerNotDisplayable" property of an appointmentSlot to false if you want to create the corresponding
          //row / column without actually showing the appointment as available
          //for example, if you want to display the day before the first available day on the calendar
          return appointmentSlot && !appointmentSlot.get('slotPickerNotDisplayable') ? appointmentSlot : null;
        });
        return {
          col,
          cellsForCol
        };
      });
    }
  ),

  days: map('cols', function (col) {
    return moment(col.get('dayId'));
  }),

  //move to: loading mixin
  notDisplayableAppointmentSlots: filterBy('availableAppointmentSlots', 'slotPickerNotDisplayable', true),
  displayableAppointmentSlots: setDiff('availableAppointmentSlots', 'notDisplayableAppointmentSlots'),
  isLoading: equal('displayableAppointmentSlots.length', 0),

  actions: {
    onSelectSlot(slot) {
      const onSelectSlot = this.get('select');

      if (onSelectSlot) {
        return onSelectSlot(slot);
      } else {
        // if no select action passed into component, mutate selected property. note this violates
        // ddau so should be refactored at some pointi
        if (this.get('canSelectMultipleSlots')) {
          this.get('selected').pushObject(slot);
        } else {
          this.set('selected', slot);
        }

        return true;
      }
    },

    onDeselectSlot(slot) {
      const onDeselectSlot = this.get('deselect');

      if (onDeselectSlot) {
        return onDeselectSlot(slot);
      } else {
        this.get('multiSelected').removeObject(slot);

        return true;
      }
    }
  }
});
