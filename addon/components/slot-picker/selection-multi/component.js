import { sort } from '@ember/object/computed';
import Component from 'ember-appointment-slots-pickers/components/slot-picker/base/component';
import layout from './template';

export default Component.extend({
  layout,

  sorting: ['slotPickerTime:asc'],//eslint-disable-line
  sorted: sort('multiSelected', 'sorting')
});
