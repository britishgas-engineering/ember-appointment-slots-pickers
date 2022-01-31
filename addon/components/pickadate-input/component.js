import { schedule } from '@ember/runloop';
import { observer } from '@ember/object';
import $ from 'jquery';
import Component from '@ember/component';
import layout from './template';
import moment from 'moment';

/**
* Pickadate Input Component
*
* @param {String} value
* The date used by the component
*
* @action {Action} select
* Triggered whenever the user click on a
* date, sends an empty value if
* the date is disabled
*
*/
export default Component.extend({
  layout,
  slots: null,
  slotsUpdate: null,
  jsDays: null,
  jsDaysUpdate: null,
  classNames: ['pickadate-input', 'ember-appointment-slots-pickers'],
  disable: null,
  hideToday: null,
  highlight: null,
  max: null,
  min: null,
  select: null,
  selected: null,
  setShorterDays: null,
  value: null,
  init() {
    this._super(...arguments);
    this.weekdaysShort = this.weekdaysShort || ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    this.weekdaysShorter = this.weekdaysShorter || ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  },

  /**
  * Notify the parent controller
  * that a user has clicked on a
  * select date
  * @param  {Event} e event object
  * @return {undefined}
  */
  onPickerDayClick: function (e) {

    const $el = $(e.target);

    if ($el.hasClass('picker__day--disabled')) {
      this.select();
    }

  },

  onPickerFocus: function () {
    // alert('focus');
    if (document.querySelector('.picker__holder')) {
      this.$('.picker__holder').blur();
      return false;
    }
  },

  /**
  * Notify the parent element
  * of the user choice
  * @param  {Event} e event object
  * @return {undefined}
  */
  onPickerSet: function (e) {
    if (e.select) {
      this.select(e.select);
    }
  },

  /**
  * Update the picker selected date
  * @return {undefined}
  */
  onValueChanged: observer('value', function () {//eslint-disable-line
    if (this.value) {

      // Set the value on the picker and mute
      // the callback to avoid an action being
      // triggered and follow a strict one way
      // pattern
      this.picker.set('select', this.value, {muted: true});
    }
  }),

  onSelectionChanged: observer('selected', function () {//eslint-disable-line
    if (!this.isDestroyed && this.selected) {
      this.picker.set('select', moment(this.get('selected.slotPickerDay'), 'YYYYMMDD').toDate(), {muted: true});
    }
  }),

  _renderJsDays() {
    const jsDays = this.jsDays;
    if (jsDays) {
      //https://github.com/amsul/pickadate.js/issues/364#issuecomment-39355634.
      // Disable all the dates.
      this.picker.set('disable', true);
      this.picker.set('enable', false);

      this.picker.set('disable', jsDays);
      this.set('jsDaysUpdate', jsDays);
      // Flip the dates.
      this.picker.set('disable', 'flip');
      this.picker.set('enable', 'flip');
    }
  },

  _renderSlots() {
    const slots = this.slots;
    if (slots) {
      //https://github.com/amsul/pickadate.js/issues/364#issuecomment-39355634.
      // Disable all the dates.
      this.picker.set('disable', true);
      this.picker.set('enable', false);

      const enabledDays = slots.map(function (day) {
        return moment(day.get('date')).toDate();
      });
      this.picker.set('disable', enabledDays);
      this.set('slotsUpdate', slots);
      // Flip the dates.
      this.picker.set('disable', 'flip');
      this.picker.set('enable', 'flip');
    }
  },

  _render() {
    this.picker.off('set');

    this._renderJsDays();
    this._renderSlots();

    if (this.highlight) {
      this.picker.set('view', this.highlight, {format: 'yyyy-mm-dd'});
    }

    if (this.selected) {
      this.picker.set('select', moment(this.get('selected.slotPickerDay')).format('YYYY-MM-DD'), {format: 'yyyy-mm-dd'});
    }

    if (this.value) {
      this.picker.set('select', this.value, {muted: true});
    }
    this.picker.set('min', this.min ? this.min : false);
    this.picker.set('max', this.max ? this.max : false);

    //handle loading state on slot-picker-pickadate component
    if (this.get('jsDays.length') || this.get('slots.length') || this.max) {
      this.picker.on('set', this.onPickerSet.bind(this));
    }
  },

  /**
  * Start the pickadate instance
  * @return {undefined}
  */
  didInsertElement: function () {

    this._super(...arguments);
    const $input = this.$('input').pickadate({
      weekdaysShort: this.setShorterDays ? this.weekdaysShorter : this.weekdaysShort,
      firstDay: 1,
      min: this.min ? this.min : false,
      max: this.max ? this.max : false,
      klass: {
        now: this.value || this.hideToday ? '' : 'picker__day--today'
      }
    });

    schedule('afterRender', this, function () {
      this.picker = $input.pickadate('picker');
      this._render();

      this.$('.picker__holder')
        .on('click', '.picker__day', this.onPickerDayClick.bind(this))
        .on('focus', this.onPickerFocus.bind(this));

    });
  },

  didUpdateAttrs() {
    this._super(...arguments);

    const jsDaysUpdate = this.jsDaysUpdate;
    const jsDays = this.jsDays;
    const jsDaysLength = jsDays && jsDays.length;
    const jsDaysUpdateLength = jsDaysUpdate && jsDaysUpdate.length;
    if (this.picker && jsDaysLength !== jsDaysUpdateLength) {
      this._render();
    }

    const slotsUpdate = this.slotsUpdate;
    const slots = this.slots;
    const slotsLength = slots && slots.length;
    const slotsUpdateLength = slotsUpdate && slotsUpdate.length;
    if (this.picker && slotsLength !== slotsUpdateLength) {
      this._render();
    }
  }

});
