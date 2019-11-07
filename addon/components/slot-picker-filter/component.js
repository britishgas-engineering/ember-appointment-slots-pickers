import {union} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import Component from '@ember/component';
import EmberObject, {computed} from '@ember/object';
import layout from './template';

export default Component.extend({
  layout: layout,
  timeSlots: [],
  viewport: service(),
  areTimeSlotsHidden: true,
  selectedFilter: null,
  /**
   * inputTimeSlots caches the initial timeSlots, therefore ignoring any further change due to the filtering itself.
   */
  inputTimeSlots: computed(function () {
    return this.get('timeSlots');
  }),
  fixedTimeSlots: [
    EmberObject.create({
      id: 'showall',
      label: 'Show all'
    })
  ],
  allTimeSlots: union('inputTimeSlots', 'fixedTimeSlots'),
  areSlotsEven: computed('allTimeSlots.[]', function () {
    return this.get('allTimeSlots.length') % 2 === 0;
  }),
  selectedTimeSlot: computed('selectedFilter', 'allTimeSlots', function () {
    const defaultTimeSlot = this.get('allTimeSlots').findBy('id', 'showall');
    return this.get('selectedFilter') || defaultTimeSlot;
  }),
  actions: {
    filterButtonClick() {
      this.toggleProperty('areTimeSlotsHidden');
    },
    timeSlotButtonClick(selectedInternalTimeSlot) {
      this.set('selectedFilter', selectedInternalTimeSlot);
      this.set('areTimeSlotsHidden', true);
      this.sendAction('changeFilter', selectedInternalTimeSlot.id === 'showall' ? null : selectedInternalTimeSlot);
    }
  }
});
