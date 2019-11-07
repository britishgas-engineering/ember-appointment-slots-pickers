import Component from '@ember/component';
import layout from './template';
import {computed} from '@ember/object';

export default Component.extend({
  layout,
  action: null,
  multiSelected: [],
  appointmentSlot: null,
  classNames: ['slot-picker-button'],
  isSelected: computed('multiSelected.@each.id', 'appointmentSlot', function () {
    const multiSelected = this.get('multiSelected');
    const appointmentSlot = this.get('appointmentSlot');

    return multiSelected.includes(appointmentSlot);
  })
});
