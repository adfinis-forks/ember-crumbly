import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { click, visit, currentRouteName } from '@ember/test-helpers';

module('Acceptance | ember-crumbly integration test', function(hooks) {
  setupApplicationTest(hooks);

  test('routeHierarchy returns the correct number of routes', async function(assert) {
    assert.expect(3);
    await visit('/foo/bar/baz');

    let componentInstance = this.owner.lookup('component:bread-crumbs');
    assert.equal(
      componentInstance.get('routeHierarchy').length,
      3,
      'returns correct number of routes'
    );
    assert.dom('#bootstrapLinkable li').exists({ count: 3 });
    assert.equal(
      currentRouteName(),
      'foo.bar.baz.index',
      'correct current route name'
    );
  });

  test('routes that opt-out are not shown', async function(assert) {
    assert.expect(3);
    await visit('/foo/bar/baz/hidden');

    let componentInstance = this.owner.lookup('component:bread-crumbs');
    assert.equal(
      componentInstance.get('routeHierarchy').length,
      3,
      'returns correct number of routes'
    );
    assert.dom('#foundationLinkable li').exists({ count: 3 });
    assert.equal(
      currentRouteName(),
      'foo.bar.baz.hidden',
      'correct current route name'
    );
  });

  test('top-level flat routes render correctly', async function(assert) {
    assert.expect(4);
    await visit('/about');

    assert.dom('#foundationLinkable li').exists();
    let componentInstance = this.owner.lookup('component:bread-crumbs');
    assert.equal(currentRouteName(), 'about', 'correct current route name');
    assert.equal(
      componentInstance.get('routeHierarchy').length,
      1,
      'returns correct number of routes'
    );
    assert.dom('#foundationLinkable li').hasText('About Derek Zoolander');
  });

  test('routes can set dynamic breadcrumb props', async function(assert) {
    assert.expect(5);
    await visit('/foo/bar/baz/show');

    let componentInstance = this.owner.lookup('component:bread-crumbs');
    let routeHierarchy = componentInstance.get('routeHierarchy');
    let routeTitles = routeHierarchy.map((route) => route.title);
    let routeLooks = routeHierarchy.map((route) => route.look);
    let routeLinkables = routeHierarchy.map((route) => route.linkable);
    let hasDynamicTitle = routeTitles.filter(
      (title) => title === 'Derek Zoolander'
    ).length;
    let hasDynamicLook = routeLooks.filter((look) => look === 'Blue Steel')
      .length;
    let hasDynamicLinkable = routeLinkables.filter(
      (linkable) => linkable === false
    ).length;
    assert.equal(
      currentRouteName(),
      'foo.bar.baz.show',
      'correct current route name'
    );
    assert.equal(routeHierarchy.length, 4, 'returns correct number of routes');
    assert.ok(hasDynamicTitle, 'returns the correct title prop');
    assert.ok(hasDynamicLinkable, 'returns the correct linkable prop');
    assert.ok(hasDynamicLook, 'returns the correct arbitrary prop');
  });

  test('breadcrumb data includes isTail and isHead', async function(assert) {
    assert.expect(4);
    await visit('/foo/bar/baz/show');

    let componentInstance = this.owner.lookup('component:bread-crumbs');
    let routeHierarchy = componentInstance.get('routeHierarchy');

    assert.equal(routeHierarchy[0].isHead, true, 'first route is head');
    assert.equal(routeHierarchy[1].isHead, false, 'second route is not head');
    assert.equal(routeHierarchy[0].isTail, false, 'first route is not tail');
    assert.equal(
      routeHierarchy[routeHierarchy.length - 1].isTail,
      true,
      'last route is tail'
    );
  });

  test('first route is tail and head when on root', async function(assert) {
    assert.expect(3);
    await visit('/foo');

    let componentInstance = this.owner.lookup('component:bread-crumbs');
    let routeHierarchy = componentInstance.get('routeHierarchy');

    assert.equal(routeHierarchy.length, 1, 'There is 1 route');
    assert.equal(routeHierarchy[0].isHead, true, 'first route is head');
    assert.equal(routeHierarchy[0].isTail, true, 'first route is tail');
  });

  test('routes that are not linkable do not generate an <a> tag', async function(assert) {
    assert.expect(3);
    await visit('/foo/bar/baz/');

    assert.equal(
      currentRouteName(),
      'foo.bar.baz.index',
      'correct current route name'
    );
    assert.dom('#bootstrapLinkable li').exists({ count: 3 });
    assert.dom('#bootstrapLinkable li a').exists({ count: 2 });
  });

  test('bread-crumbs component outputs the right class', async function(assert) {
    assert.expect(3);
    await visit('/foo');

    assert.dom('ul#foundationLinkable').hasClass('breadcrumbs');
    assert.dom('ol#bootstrapLinkable').hasClass('breadcrumb');
    assert.equal(currentRouteName(), 'foo.index', 'correct current route name');
  });

  test('bread-crumbs component accepts a block', async function(assert) {
    assert.expect(4);
    await visit('/animal/quadruped/cow/show');

    assert
      .dom('#customBlock li:first-child span')
      .hasText('Animals at the Zoo');
    assert.dom('#customBlock li:nth-child(2) span').hasText('Cows');
    assert.dom('#customBlock li:last-child span').hasText('Mary (5 years old)');
    assert.equal(
      currentRouteName(),
      'animal.quadruped.cow.show',
      'correct current route name'
    );
  });

  test('routes with no breadcrumb should render with their capitalized inferred name', async function(assert) {
    assert.expect(4);
    await visit('/dessert/cookie');

    assert.dom('ol#bootstrapLinkable li:first-child').includesText('Dessert');
    assert.dom('ol#bootstrapLinkable li:last-child').includesText('Cookie');
    assert.dom('ol#bootstrapLinkable li:first-child a').includesText('Dessert');
    assert.dom('ol#bootstrapLinkable li:last-child a').doesNotExist();
  });

  test('absence of reverse option renders breadcrumb right to left', async function(assert) {
    assert.expect(4);
    await visit('/foo/bar/baz');

    assert.dom('#bootstrapLinkable li').exists({ count: 3 });
    assert.dom('#bootstrapLinkable li:first-child').hasText('I am Foo Index');
    assert.dom('#bootstrapLinkable li:nth-child(2)').hasText('I am Bar');
    assert.dom('#bootstrapLinkable li:last-child').hasText('I am Baz');
  });

  test('reverse option = TRUE renders breadcrumb from left to right', async function(assert) {
    assert.expect(4);
    await visit('/foo/bar/baz');

    assert.dom('#reverseBootstrapLinkable li').exists({ count: 3 });
    assert.dom('#reverseBootstrapLinkable li:first-child').hasText('I am Baz');
    assert.dom('#reverseBootstrapLinkable li:nth-child(2)').hasText('I am Bar');
    assert
      .dom('#reverseBootstrapLinkable li:last-child')
      .hasText('I am Foo Index');
  });

  test('bread-crumbs component outputs crumbClass on li elements', async function(assert) {
    assert.expect(3);
    await visit('/foo/bar/baz');

    assert.equal(
      currentRouteName(),
      'foo.bar.baz.index',
      'correct current route name'
    );
    assert.dom('#customCrumbClass li').exists({ count: 3 });
    assert.dom('#customCrumbClass li.breadcrumb-item').exists({ count: 3 });
  });

  test('bread-crumbs component outputs linkClass on a elements', async function(assert) {
    assert.expect(3);
    await visit('/foo/bar/baz');

    assert.equal(
      currentRouteName(),
      'foo.bar.baz.index',
      'correct current route name'
    );
    assert.dom('#customLinkClass a').exists({ count: 2 });
    assert.dom('#customLinkClass a.breadcrumb-link').exists({ count: 2 });
  });

  test('bread-crumbs change when the route is changed', async function(assert) {
    assert.expect(4);
    await visit('/foo/bar/baz');

    assert.equal(
      currentRouteName(),
      'foo.bar.baz.index',
      'correct current route name'
    );
    assert.dom('#bootstrapLinkable li:last-child').hasText('I am Baz');

    await click('#bootstrapLinkable li:first-child a');

    assert.equal(
      currentRouteName(),
      'foo.index',
      'correct current route name (after transition)'
    );
    assert.dom('#bootstrapLinkable li:last-child').hasText('I am Foo Index');
  });

  test('bread-crumbs component updates when dynamic segments change', async function(assert) {
    assert.expect(4);
    await visit('/foo/bar/baz/1');

    assert.equal(
      currentRouteName(),
      'foo.bar.baz.show-with-params',
      'correct current route name'
    );
    assert.dom('#bootstrapLinkable li:last-child').hasText('Derek Zoolander');

    await click('#hansel');

    assert.equal(
      currentRouteName(),
      'foo.bar.baz.show-with-params',
      'correct current route name'
    );
    assert.dom('#bootstrapLinkable li:last-child').hasText('Hansel McDonald');
  });

  test('parent route becomes linkable when navigating to child', async function(assert) {
    assert.expect(4);
    await visit('/foo/bar');

    assert.dom('#bootstrapLinkable li').exists({ count: 2 });
    assert.dom('#bootstrapLinkable li a').exists({ count: 1 });

    await visit('/foo/bar/baz');

    assert.dom('#bootstrapLinkable li').exists({ count: 3 });
    assert.dom('#bootstrapLinkable li a').exists({ count: 2 });
  });

  test('uses path from breadCrumb if present', async function(assert) {
    assert.expect(2);
    await visit('/bar/baz');

    assert.equal(currentRouteName(), 'bar.baz', 'correct current route name');

    await click('#bootstrapLinkable li:first-child a');

    assert.equal(currentRouteName(), 'foo.index', 'correct current route name');
  });
});
