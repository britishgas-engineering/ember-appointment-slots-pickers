import { filter } from '@ember/object/computed';
import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  layout,
  init() {
    this._super(...arguments);
    this.appointmentSlots = this.appointmentSlots || [];
  },
  appointmentSlotsNotEmpty: filter('appointmentSlots', function (appointmentSlot) {
    return !!appointmentSlot;
  }),
  dayMoment: computed('appointmentSlotsNotEmpty.firstObject.slotPickerDay', function () {
    return moment(this.get('appointmentSlotsNotEmpty.firstObject.slotPickerDay'));
  }).readOnly(),
  dayOfWeek: computed('dayMoment', function () {
    const startMoment = this.dayMoment;
    return startMoment.format('dddd');
  }),
  day: computed('dayMoment', function () {
    const startMoment = this.dayMoment;
    return startMoment.format('Do');
  }),
  month: computed('dayMoment', function () {
    const startMoment = this.dayMoment;
    return startMoment.format('MMMM');
  })
});
