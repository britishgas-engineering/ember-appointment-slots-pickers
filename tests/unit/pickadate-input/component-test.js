import { module } from 'qunit';
import {
  test} from 'qunit'; import {setupTest
} from 'ember-qunit';

module('Unit | Component | slots-picker/pickadate input', function (hooks) {
  setupTest(hooks);

  test('on blur method calls', function (assert) {
    const blurSpy = sinon.spy();
    const stub = sinon.stub(document, 'querySelector').returns(false);
    const component = this.owner.factoryFor('component:pickadate-input').create({
      $: sinon.stub().returns({blur: blurSpy}),
    });
    component.onPickerFocus();
    assert.ok(blurSpy.notCalled, 'not called the blur spy');
    stub.restore();
  });
  test('on blur method calls true', function (assert) {
    const blurSpy = sinon.spy();
    const stub = sinon.stub(document, 'querySelector').returns(true);
    const component = this.owner.factoryFor('component:pickadate-input').create({
      $: sinon.stub().returns({blur: blurSpy}),
    });
    component.onPickerFocus();
    assert.ok(blurSpy.called, 'called the blur spy');
    stub.restore();
  });
});
