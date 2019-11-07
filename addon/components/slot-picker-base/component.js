import {computed} from '@ember/object';
import Component from '@ember/component';
import {assert} from '@ember/debug';
import {run} from '@ember/runloop';
import moment from 'moment';

export default Component.extend({
  baseProps: {},
  days: computed('baseProps.days', function () {
    return this.get('baseProps.days');
  }).readOnly(),
  rows: computed('baseProps.rows', function () {
    return this.get('baseProps.rows');
  }).readOnly(),
  cols: computed('baseProps.cols', function () {
    return this.get('baseProps.cols');
  }).readOnly(),
  cellsPerCol: computed('baseProps.cellsPerCol', function () {
    return this.get('baseProps.cellsPerCol');
  }).readOnly(),
  multiSelected: computed('baseProps.multiSelected', function () {
    return this.get('baseProps.multiSelected');
  }).readOnly(),
  noSlotLabel: computed('baseProps.noSlotLabel', function () {
    return this.get('baseProps.noSlotLabel');
  }).readOnly(),
  slotsAreLoading: computed('baseProps.slotsAreLoading', function () {
    return this.get('baseProps.slotsAreLoading');
  }).readOnly(),
  selectedFilter: computed('baseProps.selectedFilter', function () {
    return this.get('baseProps.selectedFilter');
  }).readOnly(),
  canSelectMultipleSlots: computed('baseProps.canSelectMultipleSlots', function () {
    return this.get('baseProps.canSelectMultipleSlots');
  }).readOnly(),

  didInsertElement() {
    this._super(...arguments);

    run.next(this, '_checkForLoadingComponentPresence');
  },

  _checkForLoadingComponentPresence() {
    if (!this.isDestroyed) {
      assert(
        'this component has no default loader defined, please insert a loading component before this one in your implementation',
        !this.get('slotsAreLoading')
      );
    }
  },

  actions: {
    onDateChange(date) {
      if (this.baseProps.selectedFilter) {
        const col = this.get('cellsPerCol').find((item) => {
          const dayId = item.col.dayId;

          return dayId && moment(dayId).isSame(date, 'date');
        });

        if (col && col.cellsForCol.length && this.onSelectSlot) {
          this.onSelectSlot(col.cellsForCol[0]);
        }
      }
    }
  }
});
