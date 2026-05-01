'use strict';

import JsonStore from './json-store.js';

const gpuStore = {
  //store for gpu data
  store: new JsonStore('./models/gpu-store.json', { categories: [] }),
  collection: 'categories',

  makeId(prefix, value) {
    const base = (value || prefix)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${base || prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  },

  getCategories() {
    return this.store.findAll(this.collection);
  },

  isDefaultCategory(category) {
    return Boolean(category?.isDefault);
  },

  canViewCategory(category, userId) {
    return Boolean(category) && (this.isDefaultCategory(category) || category.userid === userId);
  },

  canEditCategory(category, userId) {
    return Boolean(category) && !this.isDefaultCategory(category) && category.userid === userId;
  },

  getVisibleCategories(userId) {
    return this.store.findBy(this.collection, (category) => this.canViewCategory(category, userId));
  },

  searchVisibleCategories(search, userId) {
    return this.store.findBy(
      this.collection,
      (category) => this.canViewCategory(category, userId) && category.name.toLowerCase().includes(search.toLowerCase()),
    );
  },

  getUserCategories(userId) {
    return this.store.findBy(this.collection, (category) => category.userid === userId);
  },

  searchUserCategories(search, userId) {
    return this.store.findBy(
      this.collection,
      (category) => category.userid === userId && category.name.toLowerCase().includes(search.toLowerCase()),
    );
  },

  //method used by category controller to find matching category of the passed id
  getCategoryById(id) {
    const filter = (category) => category.id === id;
    return this.store.findOneBy(this.collection, filter);
  },

  getVisibleGpuOptions(userId) {
    const categories = this.getVisibleCategories(userId);
    const options = [];

    for (const category of categories) {
      for (const gpu of category.gpus || []) {
        options.push({
          key: `${category.id}::${gpu.id}`,
          categoryId: category.id,
          categoryName: category.name,
          gpu,
        });
      }
    }

    return options;
  },

  getVisibleGpuByKey(key, userId) {
    if (!key || !key.includes('::')) {
      return null;
    }

    const [categoryId, gpuId] = key.split('::');
    const category = this.getCategoryById(categoryId);
    if (!this.canViewCategory(category, userId)) {
      return null;
    }

    const gpu = (category.gpus || []).find((item) => item.id === gpuId);
    if (!gpu) {
      return null;
    }

    return {
      key,
      categoryId,
      categoryName: category.name,
      gpu,
    };
  },

  getAverageComputePowerTF(category) {
    if (!category.gpus || category.gpus.length === 0) {
      return 0;
    }
    const total = category.gpus.reduce((sum, gpu) => sum + Number(gpu.computePowerTF || 0), 0);
    return Math.round((total / category.gpus.length) * 10) / 10;
  },

  async addCategory(name, userId) {
    const category = {
      userid: userId,
      isDefault: false,
      id: this.makeId('category', name),
      name: name.trim(),
      gpus: [],
    };
    await this.store.addCollection(this.collection, category);
    return category;
  },

  async deleteCategory(categoryId) {
    const category = this.getCategoryById(categoryId);
    if (!category) {
      return false;
    }
    await this.store.removeCollection(this.collection, category);
    return true;
  },

  async addGpuToCategory(categoryId, gpuData) {
    const category = this.getCategoryById(categoryId);
    if (!category) {
      return false;
    }
    const gpu = {
      id: this.makeId('gpu', gpuData.name),
      name: gpuData.name.trim(),
      computePowerTF: Number(gpuData.computePowerTF),
      powerWatts: Number(gpuData.powerWatts),
      vramGB: Number(gpuData.vramGB),
      releaseDate: gpuData.releaseDate,
    };
    await this.store.addItem(this.collection, categoryId, 'gpus', gpu);
    return true;
  },

  async updateGpuInCategory(categoryId, gpuId, gpuData) {
    const category = this.getCategoryById(categoryId);
    if (!category) {
      return false;
    }
    const existingGpu = category.gpus.find((gpu) => gpu.id === gpuId);
    if (!existingGpu) {
      return false;
    }
    const updatedGpu = {
      id: existingGpu.id,
      name: gpuData.name.trim(),
      computePowerTF: Number(gpuData.computePowerTF),
      powerWatts: Number(gpuData.powerWatts),
      vramGB: Number(gpuData.vramGB),
      releaseDate: gpuData.releaseDate,
    };
    await this.store.editItem(this.collection, categoryId, gpuId, 'gpus', updatedGpu);
    return true;
  },

  async deleteGpuFromCategory(categoryId, gpuId) {
    const category = this.getCategoryById(categoryId);
    if (!category) {
      return false;
    }
    const existingGpu = category.gpus.find((gpu) => gpu.id === gpuId);
    if (!existingGpu) {
      return false;
    }
    await this.store.removeItem(this.collection, categoryId, 'gpus', gpuId);
    return true;
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
      avgComputePowerTF: totalGpus ? Math.round((totalCompute / totalGpus) * 10) / 10 : 0,
    };

    return stats;
  }
};

export default gpuStore;

