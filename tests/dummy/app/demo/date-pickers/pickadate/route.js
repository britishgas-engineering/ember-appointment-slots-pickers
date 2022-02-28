import Route from '@ember/routing/route';
import moment from 'moment';
import { map } from '@ember/object/computed';
import { computed } from '@ember/object';
import EmberObject from '@ember/object';

export default Route.extend({
  model() {
    const dates = [];
    //buld a calendar schedule for any timeframe between 2 weeks and one Year
    for (let i = 0; i < Math.round(Math.random() * 305) + 15; i = i + 1) {
      if (Math.random() > 0.5) {
        dates.push(moment().add(i, 'days'));
      }
    }

    return EmberObject.create({
      selectedDate: {slotPickerDay: dates[1]},
      dates
    });
  },
  setupController() {
    this.controller.setProperties({
      jsDays: this.jsDays,
      min: this.min,
      max: this.max
    });
    this._super(...arguments);
  },
  jsDays: map('currentModel.dates', function (day) {
    return moment(day).toDate();
  }),

  min: computed('jsDays.firstObject', function () {
    const firstDay = this.get('jsDays.firstObject');
    if (!firstDay) {
      return false;
    }
    return [
      firstDay.getFullYear(),
      firstDay.getMonth(),
      firstDay.getDate()
    ];
  }),

  max: computed('jsDays.lastObject', function () {
    const lastDay = this.get('jsDays.lastObject');
    if (!lastDay) {
      return false;
    }
    return [
      lastDay.getFullYear(),
      lastDay.getMonth(),
      lastDay.getDate()
    ];
  }),

  actions: {
    select(dateSt) {
      this.currentModel.set('selectedDate',  {slotPickerDay: moment(dateSt)});
    }
  }
});
