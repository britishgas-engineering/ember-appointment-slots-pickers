import { filter } from '@ember/object/computed';
import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';

export default Component.extend({
  layout,
  init() {
    this._super(...arguments);
    this.appointmentSlots = this.appointmentSlots || [];
  },
  appointmentSlotsNotEmpty: filter('appointmentSlots', function (appointmentSlot) {
    return !!appointmentSlot;
  }),
  startMoment: computed('appointmentSlotsNotEmpty.firstObject.startMoment', function () {
    return this.get('appointmentSlotsNotEmpty.firstObject.startMoment');
  }).readOnly(),
  dayOfWeek: computed('startMoment', function () {
    const startMoment = this.get('startMoment');
    return startMoment.format('dddd');
  }),
  day: computed('startMoment', function () {
    const startMoment = this.get('startMoment');
    return startMoment.format('Do');
  }),
  month: computed('startMoment', function () {
    const startMoment = this.get('startMoment');
    return startMoment.format('MMMM');
  })
});
