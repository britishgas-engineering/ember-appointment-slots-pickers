import {run} from '@ember/runloop';
import {assign} from '@ember/polyfills';
import moment from 'moment';

export function generateAppointmentSlots(options) {

  // Override defaults with optional options
  const defaults = {
    numberOfAppointments: 50
  };
  const custom = assign(defaults, options);

  // Schema for generating appoinments
  const schema = [{
    startHour: 8,
    endHour: 13
  }, {
    startHour: 10,
    endHour: 14
  }, {
    startHour: 12,
    endHour: 18
  }, {
    startHour: 16,
    endHour: 18,
    variant: 'EVENING'
  }, {
    startHour: 8,
    endHour: 18,
    variant: 'ALLDAY'
  }];

  // Empty appointmentSlots array
  const appointmentSlots = [];

  run(() => {
    // Loop and push created store records to appointmentSlots array
    this.store = this.owner.lookup('service:store');
    for (let i = 0; i < custom.numberOfAppointments; i += 1) {
      const s = schema[i % schema.length];
      const startMoment = moment().days(15).hours(0).minutes(0).seconds(0).add(1 + i / schema.length, 'days');
      appointmentSlots.push(this.store.createRecord('appointment-slot', {
        startTime: moment(startMoment).hours(s.startHour).minutes(0).seconds(5).format(),
        endTime: moment(startMoment).hours(s.endHour).minutes(0).seconds(5).format(),
        variant: s.variant,
        available: Math.random() > 0.5
      }));
    }
    // Set the generated appoinment slots to this
    this.set('generatedAppointmentSlots', appointmentSlots);
    const availableAppointmentSlots = appointmentSlots.filterBy('available', true);
    this.set('availableAppointmentSlots', availableAppointmentSlots);
    const firstSlot = availableAppointmentSlots[0] && moment(availableAppointmentSlots[0].get('slotPickerDay'));
    this.set('firstSlot', firstSlot);
    const firstMonth = firstSlot && firstSlot.format('M');
    const availableSlotsOfFirstMonth = availableAppointmentSlots.filter((slot) => {
      return moment(slot.get('slotPickerDay')).format('M') === firstMonth;
    });
    const availableDaysOfFirstMonth = availableSlotsOfFirstMonth.map((slot) => {
      return moment(slot.get('slotPickerDay')).format('D');
    }).uniq();
    this.set('availableDaysOfFirstMonth', availableDaysOfFirstMonth);

    const availableDays = availableAppointmentSlots.map((slot) => {
      return moment(slot.get('slotPickerDay')).format('D');
    }).uniq();
    this.set('firstAvailableDay', availableDays[0]);
    this.set('secondAvailableDay', availableDays[1]);

    const slotsOfDate1 = availableAppointmentSlots.filter((slot) => {
      return moment(slot.get('slotPickerDay')).format('D') === availableDays[0];
    });
    this.set('slotsOfDate1', slotsOfDate1);
  });

}
