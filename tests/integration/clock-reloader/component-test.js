import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, click, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

// Stub config service
const configServiceStub = Service.extend({
  init() {
    this._super(...arguments);
    this.config = this.config || {};
  }
});

module('Integration | Component | clock-reloader', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.owner.register('service:config-service', configServiceStub);
    this.configService = this.owner.lookup('service:config-service');
  });

  test('it renders properly when not expired', async function (assert) {

    const onrefresh = sinon.stub();

    this.set('refresh', onrefresh);

    // Template block usage:
    await render(hbs`
      <ClockReloader
        @configService={{this.configService}}
        @delay=1000000000
        @onrefresh={{action this.refresh}}
        as |isExpired refresh|
      >
        {{#if isExpired}}
          <button
            {{action refresh}}
          >
            Refresh Me
            </button>
        {{else}}
          <div class='not-expired'></div>
        {{/if}}
      </ClockReloader>
    `);
    assert.ok(findAll('.not-expired').length, 'The template is showing properly in its non expired version');
    assert.notOk(find('button'), 'The template is indeed showing properly in its non expired version');

  });

  test('it renders properly when expired', async function (assert) {

    assert.expect(1);

    const onrefresh = sinon.stub();

    this.set('refresh', onrefresh);

    // Template block usage:
    await render(hbs`
      <ClockReloader
        @configService={{this.configService}}
        @delay=0
        @onrefresh={{action this.refresh}}
        as |isExpired refresh|
      >
        {{#if isExpired}}
          <button
            {{action refresh}}
          >
            Refresh Me
            </button>
        {{else}}
          <div class='not-expired'></div>
        {{/if}}
      </ClockReloader>
    `);
    return settled().then(async () => {
      await click('button');
      assert.ok(onrefresh.called, 'The refresh action is being bubbled correctly');
    });

  });
});
