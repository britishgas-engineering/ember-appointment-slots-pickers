import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    const model = new Array(200).fill('Date');
    model[100] = 'SELECTED';
    return model;
  }
});
