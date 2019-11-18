import moment from 'moment';
import RSVP from 'rsvp';
import { run } from '@ember/runloop';
import DS from 'ember-data';
import Route from '@ember/routing/route';
import EmberObject from '@ember/object';

const schema = [{
  startHour: 8,
  endHour: 10
}, {
  startHour: 10,
  endHour: 12
}, {
  startHour: 12,
  endHour: 14
}, {
  startHour: 14,
  endHour: 16
}, {
  startHour: 14,
  endHour: 16,
  variant: 'EVENING'
}, {
  startHour: 8,
  endHour: 16,
  variant: 'ALLDAY'
}];

export default Route.extend({
  model(params) {
    const appointmentSlots = [];

    for (let i = 0; i < 54 * schema.length; i += 1) {
      const s = schema[i % schema.length];

      const startMoment = moment().add(i / schema.length + 5, 'days');
      const notDisplayable = i < schema.length + 1;//first day
      appointmentSlots.push(this.store.createRecord('appointment-slot', {
        startTime: startMoment.hours(s.startHour).minutes(0).seconds(0).format(),
        endTime: startMoment.hours(s.endHour).minutes(0).seconds(0).format(),
        variant: s.variant,
        available: Math.random() > 0.75 || notDisplayable,
        slotPickerNotDisplayable: notDisplayable
      }));
    }
    const availableSlots = appointmentSlots.filterBy('available', true);
    const showableSlots = appointmentSlots.filterBy('slotPickerNotDisplayable', false);
    const selectedSlotIndex = Math.floor(Math.random() * (availableSlots.length + 1));
    const selectedSlot = availableSlots[selectedSlotIndex];
    const model = EmberObject.create({
      selected: selectedSlot,
      appointmentSlots,
      showableSlots
    });
    this._resetAsyncSlots(model, params.delay);
    return model;
  },
  _resetAsyncSlots(model, delay) {
    //restarts the timer when changing slots-picker route
    const showableSlots = model.get('showableSlots');
    const promiseAsyncSlots = new RSVP.Promise(function (resolve) {
      run.later(this, function () {
        resolve(showableSlots);
      }, delay);
    });
    const asyncSlots = DS.PromiseArray.create({promise: promiseAsyncSlots});
    model.set('asyncSlots', asyncSlots);
    return asyncSlots;
  },
  actions: {
    resetAsyncSlots(delay) {
      return this._resetAsyncSlots(this.modelFor(this.routeName), delay);
    },
    resetSlots() {
      return true;
    }
  }
});
