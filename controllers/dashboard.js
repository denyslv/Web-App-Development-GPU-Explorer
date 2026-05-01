'use strict';

import logger from '../utils/logger.js';
import gpuStore from '../models/gpu-store.js';
import accounts from './accounts.js';

const dashboard = {
  createView(request, response) {
    logger.info('Dashboard page loading');
    const loggedInUser = accounts.getCurrentUser(request);
    if (!loggedInUser) {
      response.redirect('/');
      return;
    }

    const search = (request.query.search || '').trim();
    const sort = request.query.sort || 'none';
    const categories = (search
      ? gpuStore.searchVisibleCategories(search, loggedInUser.id)
      : gpuStore.getVisibleCategories(loggedInUser.id))
      .map((category) => ({
        ...category,
        avgComputePowerTF: gpuStore.getAverageComputePowerTF(category),
      }))
      .filter((category) => category.name.toLowerCase().includes(search.toLowerCase()));

    if (sort === 'avgComputeAsc') {
      categories.sort((a, b) => a.avgComputePowerTF - b.avgComputePowerTF);
    } else if (sort === 'avgComputeDesc') {
      categories.sort((a, b) => b.avgComputePowerTF - a.avgComputePowerTF);
    }

    const viewData = {
      title: 'GPU Dashboard',
      id: 'dashboard',
      fullname: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
      categories: categories,
      search: request.query.search || '',
      sort,
      sortAvgComputeAsc: sort === 'avgComputeAsc',
      sortAvgComputeDesc: sort === 'avgComputeDesc',
    };

    response.render('dashboard', viewData);
  },

  async addCategory(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    if (!loggedInUser) {
      response.redirect('/');
      return;
    }
    const name = (request.body.name || '').trim();
    if (name) {
      await gpuStore.addCategory(name, loggedInUser.id);
    }
    response.redirect('/dashboard');
  },

  async deleteCategory(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const category = gpuStore.getCategoryById(request.params.id);
    if (!loggedInUser || !gpuStore.canEditCategory(category, loggedInUser.id)) {
      response.redirect('/');
      return;
    }
    await gpuStore.deleteCategory(request.params.id);
    response.redirect('/dashboard');
  },

  async addGpu(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const { categoryId, name, computePowerTF, powerWatts, vramGB, releaseDate } = request.body;
    const category = gpuStore.getCategoryById(categoryId);
    if (loggedInUser && categoryId && name && gpuStore.canEditCategory(category, loggedInUser.id)) {
      await gpuStore.addGpuToCategory(categoryId, {
        name,
        computePowerTF,
        powerWatts,
        vramGB,
        releaseDate,
      });
    }
    response.redirect('/dashboard');
  },

  async updateGpu(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const { categoryId, gpuId, name, computePowerTF, powerWatts, vramGB, releaseDate } = request.body;
    const category = gpuStore.getCategoryById(categoryId);
    if (loggedInUser && categoryId && gpuId && name && gpuStore.canEditCategory(category, loggedInUser.id)) {
      await gpuStore.updateGpuInCategory(categoryId, gpuId, {
        name,
        computePowerTF,
        powerWatts,
        vramGB,
        releaseDate,
      });
    }
    response.redirect('/dashboard');
  },

  async deleteGpu(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const { categoryId, gpuId } = request.body;
    const category = gpuStore.getCategoryById(categoryId);
    if (loggedInUser && categoryId && gpuId && gpuStore.canEditCategory(category, loggedInUser.id)) {
      await gpuStore.deleteGpuFromCategory(categoryId, gpuId);
    }
    response.redirect('/dashboard');
  },
};

export default dashboard;

