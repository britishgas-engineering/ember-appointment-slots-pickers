import {sort} from '@ember/object/computed';
import Component from 'ember-commons/components/slot-picker-base/component';
import layout from './template';

export default Component.extend({
  layout,

  sorting: ['startTime:asc'],
  sorted: sort('multiSelected', 'sorting')
});
