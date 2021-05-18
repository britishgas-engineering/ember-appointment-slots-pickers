import layout from './template';
import Component from '@ember/component';
import {inject as service} from '@ember/service';

export default Component.extend({
  layout,
  title: 'Loading..',
  viewport: service()
});
