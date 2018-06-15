import Route from '@ember/routing/route';
import { set, get } from '@ember/object';

export default Route.extend({
  model() {
    return {
      name: 'Derek Zoolander',
      age: 21,
      look: 'Blue Steel'
    };
  },

  afterModel(model) {
    let name = get(model, 'name');
    let age = get(model, 'age');
    let look = get(model, 'look');

    let fashionModel = {
      title: name,
      age,
      look
    };

    set(this, 'breadCrumb', fashionModel);
  }
});
