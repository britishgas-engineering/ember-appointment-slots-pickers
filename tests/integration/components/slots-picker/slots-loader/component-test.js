import { module, test } from 'qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupRenderingTest } from 'ember-qunit';
import { set, setProperties } from '@ember/object';

module('Integration | Component | slots-picker/slots-loader', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    await render(hbs`{{slots-picker/slots-loader}}`);

    assert.equal(this.element.textContent.trim(), 'Loading..');

    // Template block usage:
    await render(hbs`
      {{#slots-picker/slots-loader}}
        template block text
      {{/slots-picker/slots-loader}}
    `);

    assert.notEqual(this.element.textContent.trim(), 'template block text');
  });

  test('title', async function(assert) {
    set(this, 'title', 'Its loading...');

    await render(hbs`{{slots-picker/slots-loader title=title }}`);

    assert.equal(this.element.textContent.trim(), 'Its loading...');
  });

  test('pre-loader', async function(assert) {
    await render(hbs`{{slots-picker/slots-loader}}`);
    assert.equal(
      this.element.querySelector('.cropDIS .pre-loader').getAttribute('src'),
      '/ember-appointment-slots-pickers/images/dot-loader-dark-blue.svg'
    );
    assert.equal(
      this.element.querySelector('.cropDIS .pre-loader').getAttribute('alt'),
      'loading...'
    );
  });

  test('showSkeletonSlot', async function(assert) {
    set(this, 'showSkeletonSlot', true);

    await render(hbs`{{slots-picker/slots-loader showSkeletonSlot=showSkeletonSlot}}`);
  
    assert.notOk(
      this.element.querySelector('.cropDIS .pre-loader')
    );
    assert.notOk(
      this.element.querySelector('.cropDIS .pre-loader')
    );

    assert.equal(
      this.element.querySelector('img').getAttribute('src'),
      '/ember-appointment-slots-pickers/images/desktop.svg'
    );
    assert.equal(
      this.element.querySelector('img').getAttribute('alt'),
      'loading...'
    );
    assert.equal(
      this.element.querySelector('img').getAttribute('aria-label'),
      'loading image'
    );
  });

  test('showSkeletonSlot - viewport', async function(assert) {
    setProperties(this, {
      showSkeletonSlot: true,
      viewport: {
        isXs: true
      }
    })

    await render(hbs`{{slots-picker/slots-loader showSkeletonSlot=showSkeletonSlot viewport=viewport}}`);

    assert.equal(
      this.element.querySelector('img').getAttribute('src'),
      '/ember-appointment-slots-pickers/images/mobile.svg'
    );

    setProperties(this, {
      showSkeletonSlot: true,
      viewport: {
        isMd: true
      }
    })

    await render(hbs`{{slots-picker/slots-loader showSkeletonSlot=showSkeletonSlot viewport=viewport}}`);

    assert.equal(
      this.element.querySelector('img').getAttribute('src'),
      '/ember-appointment-slots-pickers/images/tablet.svg'
    );
  });

  test('showSkeletonSlot - getThisOwner', async function(assert) {
    setProperties(this, {
      showSkeletonSlot: true,
      getThisOwner: {
        factoryFor() {
          return {
            class: {
              rootURL: null,
              modulePrefix: 'app'
            }
          }
        },
        lookup() {
          return {
            namespace: {
              modulePrefix: 'app'
            }
          }
        }
      }
    });

    await render(hbs`{{slots-picker/slots-loader showSkeletonSlot=showSkeletonSlot getThisOwner=getThisOwner}}`);

    assert.equal(
      this.element.querySelector('img').getAttribute('src'),
      '/engines-dist/app/ember-appointment-slots-pickers/images/desktop.svg'
    );

    setProperties(this, {
      showSkeletonSlot: true,
      getThisOwner: {
        factoryFor() {
          return {
            class: {
              rootURL: '/paul/',
              modulePrefix: 'dummy'
            }
          }
        },
        lookup() {
          return {
            namespace: {
              modulePrefix: 'app'
            }
          }
        }
      }
    });

    await render(hbs`{{slots-picker/slots-loader showSkeletonSlot=showSkeletonSlot getThisOwner=getThisOwner}}`);

    assert.equal(
      this.element.querySelector('img').getAttribute('src'),
      '/paul/engines-dist/dummy/ember-appointment-slots-pickers/images/desktop.svg'
    );

    setProperties(this, {
      showSkeletonSlot: true,
      getThisOwner: {
        factoryFor() {
          return {
            class: {
              rootURL: '/paul/',
              modulePrefix: null
            }
          }
        },
        lookup() {
          return {
            namespace: {
              modulePrefix: 'app'
            }
          }
        }
      }
    });

    await render(hbs`{{slots-picker/slots-loader showSkeletonSlot=showSkeletonSlot getThisOwner=getThisOwner}}`);

    assert.equal(
      this.element.querySelector('img').getAttribute('src'),
      '/paul/ember-appointment-slots-pickers/images/desktop.svg'
    );

    setProperties(this, {
      showSkeletonSlot: true,
      getThisOwner: {
        factoryFor() {
          return {
            class: {
              rootURL: '/',
              modulePrefix: null
            }
          }
        },
        lookup() {
          return {
            namespace: {
              modulePrefix: 'app'
            }
          }
        }
      }
    });

    await render(hbs`{{slots-picker/slots-loader showSkeletonSlot=showSkeletonSlot getThisOwner=getThisOwner}}`);

    assert.equal(
      this.element.querySelector('img').getAttribute('src'),
      '/ember-appointment-slots-pickers/images/desktop.svg'
    );

    setProperties(this, {
      showSkeletonSlot: true,
      getThisOwner: {
        factoryFor() {
          return {
            class: {
              rootURL: '/paul/',
              modulePrefix: 'app'
            }
          }
        },
        lookup() {
          return {
            namespace: {
              modulePrefix: 'dummy'
            }
          }
        }
      }
    });

    await render(hbs`{{slots-picker/slots-loader showSkeletonSlot=showSkeletonSlot getThisOwner=getThisOwner}}`);

    assert.equal(
      this.element.querySelector('img').getAttribute('src'),
      '/paul/ember-appointment-slots-pickers/images/desktop.svg'
    );

    setProperties(this, {
      showSkeletonSlot: true,
      getThisOwner: {
        factoryFor() {
          return {
            class: {
              rootURL: '/paul/',
              modulePrefix: 'dummy'
            }
          }
        },
        lookup() {
          return {
            namespace: {
              modulePrefix: 'dummy'
            }
          }
        }
      }
    });

    await render(hbs`{{slots-picker/slots-loader showSkeletonSlot=showSkeletonSlot getThisOwner=getThisOwner}}`);

    assert.equal(
      this.element.querySelector('img').getAttribute('src'),
      '/paul/ember-appointment-slots-pickers/images/desktop.svg'
    );
  });
});
