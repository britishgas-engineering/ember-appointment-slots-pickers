import Controller from '@ember/controller';

export default Controller.extend({
  currentIndex: 0,
  actions: {
    selectPrevNextItem(nb) {
      this.set('currentIndex', this.currentIndex + nb);
    }
  }
});
