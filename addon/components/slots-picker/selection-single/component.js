import Component from 'ember-appointment-slots-pickers/components/slots-picker/base/component';
import { computed } from '@ember/object';
import layout from './template';

export default Component.extend({
  layout,

  selected: computed('multiSelected', function () {
    const selected = this.multiSelected;

    return selected && selected.length ? this.multiSelected[0] : null;
  })
});
