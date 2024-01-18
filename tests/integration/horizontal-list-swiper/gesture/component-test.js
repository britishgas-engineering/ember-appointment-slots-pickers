import { test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import { module } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import $ from 'jquery';
import { click, findAll, find, render } from '@ember/test-helpers';

module(
  'Integration | Component | HorizontalListSwiper::Gesture',
  function (hooks) {
    setupRenderingTest(hooks);

    hooks.before(function () {
      //allows to use $(element).is(:offscreen) in integration tests
      //see https://stackoverflow.com/a/8897628/4325661
      $.expr.filters.offscreen =
        $.expr.filters.offscreen ||
        function (el) {
          const rect = el.getBoundingClientRect();
          const containerRect = document
            .querySelector('#ember-testing')
            .getBoundingClientRect();
          return (
            rect.x + rect.width < containerRect.x ||
            rect.y + rect.height < containerRect.y ||
            rect.x > containerRect.x + containerRect.width ||
            rect.y > containerRect.y + containerRect.height
          );
        };
      return true;
    });

    test('it renders', async function (assert) {
      assert.expect(2);

      this.set('isFirstPage', true);
      this.set('isLastPage', true);
      this.set('isRendered', false);
      this.set('currentItem', 0);
      this.items = ['tests'];

      await render(
        hbs`<HorizontalListSwiper::Gesture
          @items={{this.items}}
          @isRendered={{this.isRendered}}
          @currentItem={{this.currentItem}} />`
      );

      assert.dom('*').hasText('');

      // Template block usage:
      await render(hbs`
      <HorizontalListSwiper::Gesture
        @items={{this.items}}
        @isRendered={{this.isRendered}}
        @currentItem={{this.currentItem}}>
      </HorizontalListSwiper::Gesture>
    `);
      assert.dom('*').hasText('');
    });

    test('previous button is not shown when on the first page', async function (assert) {
      assert.expect(2);

      this.set('isFirstPage', false);
      this.set('isLastPage', false);
      this.set('isRendered', false);
      this.set('currentItem', 1);
      this.items = ['tests', 'test'];

      await render(
        hbs`<HorizontalListSwiper::Gesture
          @items={{this.items}}
          @isRendered={{this.isRendered}}
          @currentItem={{this.currentItem}} />`
      );
      assert.ok(
        findAll('.asp-scroll-btn-prev').length,
        'The previous dates button exists'
      );

      this.set('currentItem', 0);
      assert.notOk(
        findAll('.asp-scroll-btn-prev').length,
        'The previous dates button does not exist on first page'
      );
    });

    test('more dates button is shown when there is multiple pages', async function (assert) {
      assert.expect(3);

      this.set('isFirstPage', true);
      this.set('isLastPage', true);
      this.set('isRendered', false);
      this.set('currentItem', 1);
      this.items = ['tests', 'test'];
      await render(
        hbs`<HorizontalListSwiper::Gesture
          @items={{this.items}}
          @isRendered={{this.isRendered}}
          @currentItem={{this.currentItem}} />`
      );

      assert.notOk(
        $('div:contains("More dates")').length,
        'Does not show "More dates" button'
      );

      this.set('isLastPage', false);
      this.set('currentItem', 0);
      assert.ok(
        findAll('.asp-scroll-btn-next').length,
        'The more dates scroll button exists'
      );
      assert.ok(
        $('div:contains("More dates")').length,
        'Show "More dates" button when not last page'
      );
    });

    test('fade effects on slots is not shown on first and last pages', async function (assert) {
      assert.expect(4);

      this.set('isFirstPage', false);
      this.set('isLastPage', false);
      this.set('isRendered', false);
      this.set('currentItem', 1);
      this.set('items', ['tests', 'test', '3rd one']);

      await render(
        hbs`<HorizontalListSwiper::Gesture
          @items={{this.items}}
          @isRendered={{this.isRendered}}
          @currentItem={{this.currentItem}} />`
      );
      assert.ok(
        findAll('.asp-fade-left').length,
        'The left fade is shown when not first page'
      );
      assert.ok(
        findAll('.asp-fade-right').length,
        'The right fade is shown when not last page'
      );

      this.set('isFirstPage', true);
      this.set('isLastPage', true);
      this.set('currentItem', 0);
      this.set('items', ['tests']);
      assert.notOk(
        findAll('.asp-fade-left').length,
        'The left fade is not shown on first page'
      );
      assert.notOk(
        findAll('.asp-fade-right').length,
        'The right fade is not shown on last page'
      );
    });

    test('selected cell is on-screen', async function (assert) {
      const items = new Array(200);
      this.set('items', items);
      await render(hbs`<div class="is-test-env" style="height:10px;">
      <HorizontalListSwiper::Gesture @items={{this.items}} @index={{100}} as |item|>
        <div class="cell" style="width:50px; height:10px; float:left;">{{item}}</div>
        </HorizontalListSwiper::Gesture>
      </div>`);
      assert.notOk(
        $('.cell:eq(100)').is(':offscreen'),
        'selected cell is on screen'
      );
      assert.ok(
        $('.cell:eq(0)').is(':offscreen'),
        'first cell is not on screen'
      );
      assert.ok($('.asp-fade-right'), 'is not last page');
      assert.ok($('.asp-fade-left'), 'is not first page');
      assert.ok(findAll('.asp-scroll-btn-next').length, 'can see next button');
      await click('.asp-scroll-btn-next');
      assert.ok(
        $('.cell:eq(100)').is(':offscreen'),
        'selected cell is not on screen anymore on next page'
      );
    });

    test('scrollAreaStyle - with width', async function (assert) {
      const items = new Array(4);
      this.set('items', items);
      await render(hbs`<div class="is-test-env" style="height:10px;">
      <HorizontalListSwiper::Gesture @items={{this.items}} @index={{100}} as |item|>
        <div class="cell" style="width:50px; height:10px; float:left;">{{item}}</div>
        </HorizontalListSwiper::Gesture>
      </div>`);
      const style = document.querySelector(
        '.ember-appointment-slots-pickers .asp-scroll-area-wrapper div'
      ).style;

      assert.strictEqual(style.width, '200px', 'Width of component');
      assert.strictEqual(style.display, '', 'display');
    });

    test('scrollAreaStyle - without width', async function (assert) {
      const items = new Array(4);
      this.set('items', items);
      await render(hbs`<div class="is-test-env" style="height:10px;">
      <HorizontalListSwiper::Gesture @items={{this.items}} @index={{100}} as |item|>
        <div class="cell" style="height:10px; float:left;">{{item}}</div>
        </HorizontalListSwiper::Gesture>
      </div>`);
      const style = document.querySelector(
        '.ember-appointment-slots-pickers .asp-scroll-area-wrapper div'
      ).style;

      assert.strictEqual(style.width, '0px', 'Width of component');
      assert.strictEqual(style.display, '', 'display of component');
    });

    test('scrollAreaStyle - with displayAfterRender and without width', async function (assert) {
      const items = new Array(4);
      this.set('items', items);
      await render(hbs`<div class="is-test-env" style="height:10px;">
      <HorizontalListSwiper::Gesture @items={{this.items}} @displayAfterRender={{true}} @index={{100}} as |item|>
        <div class="cell" style="height:10px; float:left;">{{item}}</div>
        </HorizontalListSwiper::Gesture>
      </div>`);
      const style = document.querySelector(
        '.ember-appointment-slots-pickers .asp-scroll-area-wrapper div'
      ).style;

      assert.strictEqual(style.width, '0px', 'Width of component');
      assert.strictEqual(style.display, 'none', 'display of component');
    });

    test('scrollAreaStyle - with displayAfterRender and width', async function (assert) {
      const items = new Array(4);
      this.set('items', items);
      await render(hbs`<div class="is-test-env" style="height:10px;">
      <HorizontalListSwiper::Gesture @items={{this.items}} @displayAfterRender={{true}} @index={{100}} as |item|>
        <div class="cell" style="width:50px; height:10px; float:left;">{{item}}</div>
        </HorizontalListSwiper::Gesture>
      </div>`);
      const style = document.querySelector(
        '.ember-appointment-slots-pickers .asp-scroll-area-wrapper div'
      ).style;

      assert.strictEqual(style.width, '200px', 'Width of component');
      assert.strictEqual(style.display, '', 'display');
    });
  }
);
