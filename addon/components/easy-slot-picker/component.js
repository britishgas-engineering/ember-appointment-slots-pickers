import layout from './template';
import { getOwner } from '@ember/application';
import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';

export default Component.extend({
  layout: layout,
  scroll: service(),
  viewport: service(),
  store: service(),
  // Attributes
  init() {
    this._super(...arguments);
    this.appointmentSlots = this.appointmentSlots || [];

    const owner = getOwner(this);
    [
      'slots-picker/slots-loader',
      'slots-picker/mobile',
      'slots-picker/desktop'
    ].forEach((templateName) => {
      assert(
        `You need to add ${templateName} in your tree-shaking to consume easy-slot-picker`,
        owner.lookup(`component:${templateName}`)
      );
    });
  },
  selected: null,
  onSelect: null,
  noSlotLabel: '',
  classNames: [
    'appointment-slot-picker',
    'text-center'
  ],
  classNameBindings: ['isTestEnv'],

  slotPickerComponentName: computed('viewport.isMobile', function () {
    const showMobile = this.get('viewport.isMobile');
    return showMobile ? 'slots-picker/mobile' : 'slots-picker/desktop';
  }),
  loaderSentence: 'Finding the next available appointments in your area..',
  actions: {
    select(appointmentSlot) {
      return this.onSelect && this.onSelect(appointmentSlot);
    }
  }
});
