import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    const model = [];
    for (let i=0; i<200; i++) {
      model.push('Date ' + i);
    }
    model[100] = 'SELECTED';
    return model;
  }
});
