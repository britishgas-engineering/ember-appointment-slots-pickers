import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return Array.from(new Array(250), (x, i) => ` -  ${i}  - `);
  }
});
