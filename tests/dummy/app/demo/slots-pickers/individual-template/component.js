import Component from '@ember/component';

export default Component.extend({
  delay: null,
  model: null,
  init() {
    this._super(...arguments);
    this.selectedSlots = this.selectedSlots || [];
  },
  actions: {
    appendSlot(slot) {
      this.get('selectedSlots').pushObject(slot);
    },

    removeSlot(slot) {
      this.get('selectedSlots').removeObject(slot);
    }
  }
});
