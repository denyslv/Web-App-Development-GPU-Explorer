'use strict';

import JsonStore from './json-store.js';

const gpuStore = {
  //store for gpu data
  store: new JsonStore('./models/gpu-store.json', { categories: [] }),
  collection: 'categories',

  getCategories() {
    return this.store.findAll(this.collection);
  },

  //method used by category controller to find matching category of the passed id
  getCategoryById(id) {
    const filter = (category) => category.id === id;
    return this.store.findOneBy(this.collection, filter);
  },

  //finds number of categories, total GPUs, avg compute
  getStats() {
    const categories = this.getCategories();
    let totalGpus = 0;
    let totalCompute = 0;

    //find the amount of gpus and their sum of compute
    for (let i = 0; i < categories.length; i++) {
      const gpus = categories[i].gpus;
      for (let j = 0; j < gpus.length; j++) {
        totalGpus = totalGpus + 1;
        totalCompute = totalCompute + gpus[j].computePowerTF;
      }
    }

    const stats = {
      totalCategories: categories.length,
      totalGpus: totalGpus,
      avgComputePowerTF: Math.round((totalCompute / totalGpus) * 10) / 10,
    };

    return stats;
  }
};

export default gpuStore;

