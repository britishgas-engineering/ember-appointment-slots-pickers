import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    const model = this.modelFor('slot-pickers');
    model.set('slotPickerName', `slot-picker-${params['slot-picker-name']}`);
    return model;
  },
  afterModel(model, transition) {
    transition.send('resetAsyncSlots', transition.queryParams.delay || 3000);
  },
  setupController(controller, model) {
    const parentController = this.controllerFor('slot-pickers');
    controller.set('delay', parentController.get('delay'));
    this._super(controller, model);
  }

});
