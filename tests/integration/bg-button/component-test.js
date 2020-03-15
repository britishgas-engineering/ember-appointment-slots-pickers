import {module} from 'qunit'; import {setupRenderingTest} from 'ember-qunit';
import {test} from 'qunit';
import {run} from '@ember/runloop';
import RSVP, {defer} from 'rsvp';
import hbs from 'htmlbars-inline-precompile';

import {render, click, findAll, find} from '@ember/test-helpers';

module('Integration | Component | bg-button', function (hooks) {
  setupRenderingTest(hooks);

  test('.yield', async function (assert) {

    await render(hbs`
      <BgButton>
        Text
      </BgButton>
    `);
    assert.equal(this.element.textContent.trim(), 'Text');

  });

  test('action', async function (assert) {

    const stub = sinon.stub();
    this.set('defaultAction', stub);

    await render(hbs`
      <BgButton
        @action={{action this.defaultAction}}
      >
        Text
      </BgButton>
    `);

    assert.ok(!stub.called, 'does not call the action without user action');

    await click('button');

    assert.ok(stub.called, 'calls the action when the user clicks on the button');

  });

  test('disabled', async function (assert) {

    const stub = sinon.stub();
    this.set('defaultAction', stub);

    await render(hbs`
      <BgButton
        @action={{action this.defaultAction}}
        @disabled={{this.disabled}}
      >
        Text
      </BgButton>
    `);

    this.set('disabled', true);
    assert.ok(find('button').disabled, 'disable the button when disabled');

    await click('button');

    assert.ok(!stub.called, 'disable the default action');

    this.set('disabled', false);
    assert.ok(!find('button').disabled, 'enable the button when not disabled');

  });

  test('icon', async function (assert) {

    const stub = sinon.stub();
    this.set('defaultAction', stub);

    await render(hbs`
      <BgButton
        @action={{action this.defaultAction}}
        @hide-icon={{hideIcon}}
        @customIcon={{customIcon}}
      >
        Text
      </BgButton>
    `);

    assert.ok(findAll('.bg-button-icon.fa.fa-angle-right').length, 'seeing default icon class');
    run(() => {
      this.set('customIcon', 'my-custom-class');
    });
    assert.notOk(findAll('.bg-button-icon.fa.fa-angle-right').length, 'pouf it disappeared');
    assert.ok(findAll('.bg-button-icon.my-custom-class').length, 'seeing customIcon class');

    run(() => {
      this.set('hideIcon', true);
    });
    assert.notOk(findAll('.bg-button-icon.fa.fa-angle-right').length, 'pouf it disappeared');
    assert.notOk(findAll('.bg-button-icon.my-custom-class').length, 'magical magic it disappeared too!');

  });

  test('loading', async function (assert) {

    const stub = sinon.stub();
    this.set('defaultAction', stub);

    await render(hbs`
      <BgButton
        @action={{action this.defaultAction}}
        @loading={{this.loading}}
      >
        Text
      </BgButton>
    `);

    this.set('loading', true);
    assert.ok(find('button').disabled, 'disable the button when loading');

    await click('button');

    assert.ok(!stub.called, 'disable the default action');

    this.set('loading', false);
    assert.ok(!find('button').disabled, 'enable the button when not loading');

  });

  test('forceLoadingToPersist promise', async function (assert) {

    const defaultAction = function () {
      return RSVP.resolve();
    };
    this.set('defaultAction', defaultAction);

    await render(hbs`
      <BgButton
        @action={{action this.defaultAction}}
        @forceLoadingToPersist={{true}}
      >
        Text
      </BgButton>
    `);

    await click('button');
    assert.ok(find('button').disabled, 'forceLoadingToPersist forces loading even after promise has returned');
  });

  test('forceLoadingToPersist non promise', async function (assert) {

    const defaultAction = function () {
      return 'bla';
    };
    this.set('defaultAction', defaultAction);

    await render(hbs`
      <BgButton
        @action={{action this.defaultAction}}
        @forceLoadingToPersist={{true}}
      >
        Text
      </BgButton>
    `);

    await click('button');
    assert.notOk(
      find('button').disabled,
      'forceLoadingToPersist does not force loading when action is not a promise'
    );
  });

  test('loading-text', async function (assert) {

    await render(hbs`
      <BgButton
        @loading={{true}}
      >
        Text
      </BgButton>
    `);

    assert.equal(find('button').textContent.trim(), 'Loading...', 'render default loading text if not provided');

    await render(hbs`
      <BgButton
        @loading={{true}}
        @loading-text="custom-loading-text"
      >
        Text
      </BgButton>
    `);

    this.set('loadingText', 'custom-loading-text');
    assert.equal(find('button').textContent.trim(), 'custom-loading-text', 'render loading text if provided');

  });

  test('async action', async function (assert) {

    const d = defer();

    this.set('asyncAction', () => {
      return d.promise;
    });

    await render(hbs`
      <BgButton
        @action={{action this.asyncAction}}
      >
        Text
      </BgButton>
    `);

    await click('button');

    assert.ok(find('button').disabled, 'when async action is triggered render loading state');

    run(() => {
      d.resolve();
    });

    assert.ok(!find('button').disabled, 'when async action completes render normal state');

  });

  test('async action - (after component has been destroyed)', async function (assert) {

    const d = defer();

    this.set('show', true);
    this.set('asyncAction', () => {
      return d.promise;
    });

    await render(hbs`
      {{#if show}}
        <BgButton
          @action={{action this.asyncAction}}
        >
          Text
        </BgButton>
      {{/if}}
    `);

    await click('button');

    assert.ok(find('button').disabled, 'when async action is triggered render loading state');

    run(() => {
      this.set('show', false);
    });

    try {
      run(() => {
        d.resolve();
      });

      assert.ok(true, 'No exception was raised by previous call');
    } catch (e) {
      assert.ok(false, e);
    }

  });
});
