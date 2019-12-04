import {module} from 'qunit';
import {test} from 'qunit'; import {setupTest} from 'ember-qunit';
import Ember from 'ember';

const emberAssertCp = Ember.assert; //eslint-disable-line

module('Unit | Component | easy-slot-picker', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    //silence assert for other components presence, check didInsertElement hook of the component
    Ember.assert = () => {}; //eslint-disable-line
  });

  hooks.afterEach(function () {
    Ember.assert = emberAssertCp; //eslint-disable-line
  });

  test('slotPickerComponentName responsiveBreak', function (assert) {
    const component = this.owner.factoryFor('component:easy-slot-picker').create({
      viewport: {
        isMobile: false
      }
    });

    assert.equal(
      component.get('slotPickerComponentName'),
      'slots-picker/desktop',
      'slots-picker-/esktop returned for large viewports'
    );

    component.set('viewport.isMobile', true);

    assert.equal(
      component.get('slotPickerComponentName'),
      'slots-picker/mobile',
      'slots-picker/mobile returned for small viewports'
    );
  });
});
