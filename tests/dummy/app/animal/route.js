import Route from '@ember/routing/route';

export default Route.extend({
  init() {
    this._super(...arguments);
    this.set('breadCrumb', {
      name:
        "Derek Zoolander's Zoo for Animals Who Can't Read Good and Want to Do Other Stuff Good Too"
    });
  }
});
