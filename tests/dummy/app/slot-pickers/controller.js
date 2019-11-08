import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['delay'], //changed for acceptance tests
  delay: 3000,
  init() {
    this._super(...arguments);
    this.slotPickerNames = this.slotPickerNames || [
      'desktop',
      'mobile',
      'cards',
      'pickadate'
    ];
  }
});
