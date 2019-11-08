import Route from '@ember/routing/route';
import moment from 'moment';

export default Route.extend({
  model() {
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
    }];
    const appointmentSlots = [];
    for (let i = 0; i < 54 * schema.length; i += 1) {
      const s = schema[i % schema.length];
      const startMoment = moment().add(i / schema.length, 'days');
      appointmentSlots.push(this.store.createRecord('appointment-slot', {
        startTime: startMoment.hours(s.startHour).minutes(0).seconds(0).format(),
        endTime: startMoment.hours(s.endHour).minutes(0).seconds(0).format(),
        variant: s.variant,
        available: Math.random() > 0.75
      }));
    }
    const fourTimeSlots = [
      {
        id: '08001000',
        slotPickerTime: '8am - 10am'
      },
      {
        id: '10001200',
        slotPickerTime: '10am - 12pm'
      },
      {
        id: '12001400',
        slotPickerTime: '12pm - 2pm'
      },
      {
        id: '14001600',
        slotPickerTime: '2am - 4pm'
      }
    ];
    const threeTimeSlots = [
      {
        id: '08001100',
        slotPickerTime: '8am - 11am'
      },
      {
        id: '11001300',
        slotPickerTime: '11am - 1pm'
      },
      {
        id: '13001600',
        slotPickerTime: '1pm - 4pm'
      }
    ];
    return {
      fourTimeSlots,
      threeTimeSlots,
      appointmentSlots
    };
  }
});
