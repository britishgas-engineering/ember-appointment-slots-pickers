import Component from 'ember-appointment-slots-pickers/components/slots-picker/base/component';
import { computed } from '@ember/object';
import layout from './template';

export default Component.extend({
  layout,

  selected: computed('multiSelected', function () {
    const selected = this.get('multiSelected');

    return selected && selected.length ? this.get('multiSelected')[0] : null;
  })
});
