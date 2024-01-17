import Route from '@ember/routing/route';
import moment from 'moment';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),
  model() {
    const schema = [
      {
        startHour: 8,
        endHour: 10,
      },
      {
        startHour: 10,
        endHour: 12,
      },
      {
        startHour: 12,
        endHour: 14,
      },
      {
        startHour: 14,
        endHour: 16,
      },
      {
        startHour: 14,
        endHour: 16,
        variant: 'EVENING',
      },
    ];
    const appointmentSlots = [];
    for (let i = 0; i < 54 * schema.length; i += 1) {
      const s = schema[i % schema.length];
      const startMoment = moment().add(i / schema.length, 'days');
      appointmentSlots.push(
        this.store.createRecord('appointment-slot', {
          startTime: startMoment
            .hours(s.startHour)
            .minutes(0)
            .seconds(0)
            .format(),
          endTime: startMoment.hours(s.endHour).minutes(0).seconds(0).format(),
          variant: s.variant,
          available: Math.random() > 0.75,
        })
      );
    }
    const fourTimeSlots = [
      EmberObject.create({
        slotPickerRowId: '08001000',
        slotPickerRowLabel: '8am - 10am',
        slotPickerAvailable: true,
      }),
      EmberObject.create({
        slotPickerRowId: '10001200',
        slotPickerRowLabel: '10am - 12pm',
        slotPickerAvailable: true,
      }),
      EmberObject.create({
        slotPickerRowId: '12001400',
        slotPickerRowLabel: '12pm - 2pm',
        slotPickerAvailable: true,
      }),
      EmberObject.create({
        slotPickerRowId: '14001600',
        slotPickerRowLabel: '2pm - 4pm',
        slotPickerAvailable: true,
      }),
    ];
    const threeTimeSlots = [
      EmberObject.create({
        slotPickerRowId: '08001100',
        slotPickerRowLabel: '8am - 10am',
        slotPickerAvailable: true,
      }),
      EmberObject.create({
        slotPickerRowId: '11001300',
        slotPickerRowLabel: '10am - 12pm',
        slotPickerAvailable: true,
      }),
      EmberObject.create({
        slotPickerRowId: '13001600',
        slotPickerRowLabel: '2pm - 4pm',
        slotPickerAvailable: true,
      }),
    ];
    return {
      fourTimeSlots,
      threeTimeSlots,
      appointmentSlots,
    };
  },
});
