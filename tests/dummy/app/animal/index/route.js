import Route from '@ember/routing/route';

export default Route.extend({
  init() {
    this._super(...arguments);
    this.set('breadCrumb', {
      name: 'Animals at the Zoo',
      description:
        'Animals are multicellular, eukaryotic organisms of the kingdom Animalia (also called Metazoa).',
      linkable: false
    });
  }
});
