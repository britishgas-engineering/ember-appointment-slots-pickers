import layout from './template';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { getOwner } from '@ember/application';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,
  title: 'Loading..',
  viewport: service(),
  getThisOwner: computed(function() {
    return getOwner(this)
  }),
  rootURL: computed(function() {
    const getThisOwner = this.get('getThisOwner');
    const { modulePrefix, rootURL } = getThisOwner.factoryFor('config:environment').class;
    const appMmodulePrefix = getThisOwner.lookup('router:main').namespace.modulePrefix;

    if (appMmodulePrefix === 'dummy') {
      return rootURL ? `${rootURL}` : '/'
    } else {
      const url = modulePrefix ? `engines-dist/${modulePrefix}/` : '';

      return rootURL ? `${rootURL}${url}`: `/${url}`;
    }
  }),
  skeletonSlotImageUrl: computed('viewport', 'baseURL', function() {
    const baseURL = this.get('baseURL') || `${this.get('rootURL')}ember-appointment-slots-pickers/images/`;
    let url = '';

    if (this.get('viewport.isXs')) {
      url = `${baseURL}mobile.svg`;
    } else if(this.get('viewport.isMd')) {
      url = `${baseURL}tablet.svg`;
    } else {
      url = `${baseURL}desktop.svg`;
    }

    return url;
  }),
  preLoaderUrl: computed('baseURL', function() {
    return this.get('baseURL') || '/ember-appointment-slots-pickers/images/dot-loader-dark-blue.svg';
  })

});
