import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'ember-qunit';
import { set } from '@ember/object';

module('Integration | Component | slots-picker/slots-loader', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(hbs`<SlotsPicker::SlotsLoader />`);

    assert.dom(this.element).hasText('Loading..');

    // Template block usage:
    await render(hbs`
      <SlotsPicker::SlotsLoader>
        template block text
      </SlotsPicker::SlotsLoader>
    `);

    assert.notEqual(this.element.textContent.trim(), 'template block text');
  });

  test('title', async function (assert) {
    set(this, 'title', 'Its loading...');

    await render(hbs`<SlotsPicker::SlotsLoader @title={{this.title}} />`);

    assert.dom(this.element).hasText('Its loading...');
  });

  test('pre-loader', async function (assert) {
    await render(hbs`<SlotsPicker::SlotsLoader />`);
    assert.strictEqual(
      this.element.querySelector('.cropDIS .pre-loader').getAttribute('src'),
      '/ember-appointment-slots-pickers/images/dot-loader-dark-blue.svg'
    );
    assert.strictEqual(
      this.element.querySelector('.cropDIS .pre-loader').getAttribute('alt'),
      'loading...'
    );
  });

  test('showSkeletonSlot', async function (assert) {
    set(this, 'showSkeletonSlot', true);

    await render(
      hbs`<SlotsPicker::SlotsLoader @showSkeletonSlot={{this.showSkeletonSlot}} />`
    );

    assert.notOk(this.element.querySelector('.cropDIS .pre-loader'));
    assert.notOk(this.element.querySelector('.cropDIS .pre-loader'));

    assert.ok(document.querySelector('.slot-loader'));
  });
});
