import {readOnly} from '@ember/object/computed';
import {computed} from '@ember/object';
import DS from 'ember-data';
import moment from 'moment';

export default DS.Model.extend({
  variant: DS.attr('string'),
  startTime: DS.attr('string'),
  endTime: DS.attr('string'),
  available: DS.attr('boolean'),
  classification: DS.attr('string'),

  variantLabel: computed('variant', function () {
    const variant = this.get('variant');
    switch(variant) {
      case 'ALLDAY': return 'All day';
      case 'AM': return 'Morning';
      case 'EVENING': return 'Evening';
      case 'FF': return 'Family friendly';
      case 'PM': return 'Afternoon';
      default: return 'Not recognized';
    }
  }),

  startMoment: computed('convertToUKTimezone', 'startTime', function () {
    if (this.get('startTime')) {
      return this.get('convertToUKTimezone') ?
        moment(this.get('startTime')).tz('Europe/London') :
        moment(this.get('startTime'));
    } else {
      return null;//NB. moment(undefined) or moment(null) returns current/now's date time.
    }
  }),

  endMoment: computed('convertToUKTimezone', 'endTime', function () {
    if (this.get('endTime')) {
      return this.get('convertToUKTimezone') ?
        moment(this.get('endTime')).tz('Europe/London') :
        moment(this.get('endTime'));
    } else {
      return null;//NB. moment(undefined) or moment(null) returns current/now's date time.
    }
  }),

  timeLabel: computed('startMoment', 'endMoment', function () {
    const startMoment = this.get('startMoment');

    const endMoment = this.get('endMoment');
    if (startMoment && endMoment) {
      const start = startMoment.format('mm') === '00' ? startMoment.format('ha') : startMoment.format('h:mma');

      const end = endMoment.format('mm') === '00' ? endMoment.format('ha') : endMoment.format('h:mma');

      return `${start} - ${end}`;
    } else {
      return '';
    }
  }),

  startTimeLabel: computed('startMoment', function () {
    const startMoment = this.get('startMoment');
    return startMoment.format('mm') === '00' ? startMoment.format('ha') : startMoment.format('h:mma');
  }),

  endTimeLabel: computed('endMoment', function () {
    const endMoment = this.get('endMoment');

    return endMoment.format('mm') === '00' ? endMoment.format('ha') : endMoment.format('h:mma');
  }),

  timeId: computed('startMoment', 'endMoment', function () {
    const startMoment = this.get('startMoment');

    const endMoment = this.get('endMoment');

    return startMoment.format('HHmm') + endMoment.format('HHmm');
  }),

  //isSpecialTimePeriod: bool('variantLabel'),

  slotPickerRowId: computed('timeId', 'variantLabel', function () {
    return this.get('timeId') + (this.get('variantLabel') || '');
  }),

  slotPickerRowLabel: computed('variantLabel', 'timeLabel', function () {
    const variantLabel = this.get('variantLabel');
    const timeLabel = this.get('timeLabel');
    return variantLabel || timeLabel;
  }),

  slotPickerRowLabelClassName: computed('variantLabel', function () {
    const variantLabel = this.get('variantLabel');
    return variantLabel ? 'bold' : '';
  }),

  slotPickerGroup: computed('variantLabel', function () {
    const variantLabel = this.get('variantLabel');
    return variantLabel ? 1 : 0;
  }),

  slotPickerDay: computed('startMoment', function () {
    const startMoment = this.get('startMoment');

    return startMoment.format('YYYYMMDD');
  }),

  slotPickerTime: readOnly('timeLabel')
});
