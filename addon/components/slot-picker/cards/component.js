import layout from './template';
import { computed } from '@ember/object';
import slotPickerBase from 'ember-appointment-slots-pickers/components/slot-picker/base/component';
import { inject as service } from '@ember/service';

export default slotPickerBase.extend({
  layout,
  viewport: service(),

  nbOfCardsPerRow: computed('days.length', function () {
    const length = this.get('days.length') || 0;
    return Math.min(5, length);
  }),

  columnClasses: computed('nbOfCardsPerRow', function () {
    const nbOfCardsPerRow = this.get('nbOfCardsPerRow');
    const colSize = Math.floor(12 / nbOfCardsPerRow);
    return `col-sm-${colSize}`;
  }),

  fiveCardsClass: computed('nbOfCardsPerRow', 'viewport.isXs', function () {
    const nbOfCardsPerRow = this.get('nbOfCardsPerRow');
    const isXs = this.get('viewport.isXs');
    return nbOfCardsPerRow === 5 && !isXs ? 'five-cards' : '';
  })

});
