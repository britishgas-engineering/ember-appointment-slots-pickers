import Route from '@ember/routing/route';
import moment from 'moment';

export default Route.extend({
  model() {
    const dates = [];

    for (let i = 0; i < Math.round(Math.random() * 305) + 15; i = i + 1) {
      if (Math.random() > 0.5) {
        dates.push(moment().add(i, 'days'));
      }
    }

    return {
      selectedDate: dates[1],
      dates
    };
  }
});
