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

  _variantLabel: computed('variant', function () {
    const variant = this.get('variant');
    switch(variant) {
      case 'ALLDAY': return 'All day';
      case 'AM': return 'Morning';
      case 'EVENING': return 'Evening';
      case 'FF': return 'Family friendly';
      case 'PM': return 'Afternoon';
      default: return null;
    }
  }),

  slotPickerStartMoment: computed('convertToUKTimezone', 'startTime', function () {
    if (this.get('startTime')) {
      return this.get('convertToUKTimezone') ?
        moment(this.get('startTime')).tz('Europe/London') :
        moment(this.get('startTime'));
    } else {
      return null;//NB. moment(undefined) or moment(null) returns current/now's date time.
    }
  }),

  _endMoment: computed('convertToUKTimezone', 'endTime', function () {
    if (this.get('endTime')) {
      return this.get('convertToUKTimezone') ?
        moment(this.get('endTime')).tz('Europe/London') :
        moment(this.get('endTime'));
    } else {
      return null;//NB. moment(undefined) or moment(null) returns current/now's date time.
    }
  }),

  slotPickerTime: computed('slotPickerStartMoment', '_endMoment', function () {
    const slotPickerStartMoment = this.get('slotPickerStartMoment');

    const _endMoment = this.get('_endMoment');
    if (slotPickerStartMoment && _endMoment) {
      const start = slotPickerStartMoment.format('mm') === '00' ? slotPickerStartMoment.format('ha') : slotPickerStartMoment.format('h:mma');

      const end = _endMoment.format('mm') === '00' ? _endMoment.format('ha') : _endMoment.format('h:mma');

      return `${start} - ${end}`;
    } else {
      return '';
    }
  }),

  slotPickerStartTimeLabel: computed('slotPickerStartMoment', function () {
    const slotPickerStartMoment = this.get('slotPickerStartMoment');
    return slotPickerStartMoment.format('mm') === '00' ? slotPickerStartMoment.format('ha') : slotPickerStartMoment.format('h:mma');
  }),

  slotPickerEndTimeLabel: computed('_endMoment', function () {
    const _endMoment = this.get('_endMoment');

    return _endMoment.format('mm') === '00' ? _endMoment.format('ha') : _endMoment.format('h:mma');
  }),

  _timeId: computed('slotPickerStartMoment', '_endMoment', function () {
    const slotPickerStartMoment = this.get('slotPickerStartMoment');

    const _endMoment = this.get('_endMoment');

    return slotPickerStartMoment.format('HHmm') + _endMoment.format('HHmm');
  }),

  slotPickerRowId: computed('_timeId', '_variantLabel', function () {
    return this.get('_timeId') + (this.get('_variantLabel') || '');
  }),

  slotPickerRowLabel: computed('_variantLabel', 'timeLabel', function () {
    const _variantLabel = this.get('_variantLabel');
    const timeLabel = this.get('timeLabel');
    return _variantLabel || timeLabel;
  }),

  slotPickerRowLabelClassName: computed('_variantLabel', function () {
    const _variantLabel = this.get('_variantLabel');
    return _variantLabel ? 'bold' : '';
  }),

  slotPickerGroup: computed('_variantLabel', function () {
    const _variantLabel = this.get('_variantLabel');
    return _variantLabel ? 1 : 0;
  }),

  slotPickerDay: computed('slotPickerStartMoment', function () {
    const slotPickerStartMoment = this.get('slotPickerStartMoment');

    return slotPickerStartMoment.format('YYYYMMDD');
  }),
  slotPickerDayLabel: computed('slotPickerStartMoment', function () {
    const slotPickerStartMoment = this.get('slotPickerStartMoment');

    return slotPickerStartMoment.format('ddd Do MMM YYYY');
  }),

  slotPickerLongDayLabel: computed('slotPickerStartMoment', function () {
    const slotPickerStartMoment = this.get('slotPickerStartMoment');

    return slotPickerStartMoment.format('dddd Do MMMM');
  }),

  slotPickerAvailable: readOnly('available')
});
