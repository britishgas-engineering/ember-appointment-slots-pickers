import Component from '@ember/component';
import layout from './template';
import { computed } from '@ember/object';

export default Component.extend({
  layout,
  action: null,
  init() {
    this._super(...arguments);
    this.multiSelected = this.multiSelected || [];
  },
  appointmentSlot: null,
  classNames: ['slot-picker-button'],
  isSelected: computed('multiSelected.@each.id', 'appointmentSlot', function () {
    const multiSelected = this.multiSelected;
    const appointmentSlot = this.appointmentSlot;

    return multiSelected.includes(appointmentSlot);
  })
});
