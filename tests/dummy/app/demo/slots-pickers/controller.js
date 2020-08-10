import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['delay'], //changed for acceptance tests
  delay: 30000,
  init() {
    this._super(...arguments);
    this.slotPickerNames = this.slotPickerNames || [
      'desktop',
      'desktop-no-category-column',
      'mobile',
      'cards',
      'pickadate'
    ];
  }
});
