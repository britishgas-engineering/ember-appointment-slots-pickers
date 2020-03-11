import { filter } from '@ember/object/computed';
import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  init() {
    this._super(...arguments);
    this.appointmentSlots = this.appointmentSlots || [];
  },
  selectedFilter: undefined,
  layout: layout,
  filteredAppointmentSlots: filter('appointmentSlots', ['selectedFilter'], function (appointmentSlot) {
    return this.get('selectedFilter') ? appointmentSlot.get('slotPickerRowId') === this.get('selectedFilter.id') : true;
  }),

  actions: {
    changeFilter(selectedFilter) {
      this.set('selectedFilter', selectedFilter);

      // clear selected slot as it may conflict
      if (this.onFilter) {
        this.onFilter();
      }
    }
  }
});
