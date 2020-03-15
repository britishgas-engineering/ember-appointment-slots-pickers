import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
//import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | foo-bar', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`Popop<FooBar />`);
    debugger;
    assert.equal(this.element.textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      <FooBar>
        template block text
      </FooBar>
    `);

    assert.equal(this.element.textContent.trim(), 'template block text');
  });
});
