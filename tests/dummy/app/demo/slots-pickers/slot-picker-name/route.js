import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    const model = this.modelFor('demo.slots-pickers');
    model.set('slotPickerName', `slots-picker/${params['slot-picker-name']}`);
    return model;
  },
  afterModel(model, transition) {
    transition.send('resetAsyncSlots', transition.to.queryParams.delay || 30000);
  },
  setupController(controller, model) {
    const parentController = this.controllerFor('demo.slots-pickers');
    controller.set('delay', parentController.get('delay'));
    this._super(controller, model);
  }

});
