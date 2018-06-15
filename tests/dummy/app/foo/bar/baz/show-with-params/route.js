import Route from '@ember/routing/route';
import { set, get } from '@ember/object';

export default Route.extend({
  init() {
    this._super(...arguments);
    this.set('breadCrumb', {});
  },

  model(params) {
    let models = [{ name: 'Derek Zoolander' }, { name: 'Hansel McDonald' }];

    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    return models[params.model_id - 1];
    // jscs:enable
  },

  afterModel(model) {
    let name = get(model, 'name');

    let fashionModel = {
      title: name
    };

    set(this, 'breadCrumb', fashionModel);
  }
});
