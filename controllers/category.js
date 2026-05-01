'use strict';

import logger from '../utils/logger.js';
import gpuStore from '../models/gpu-store.js';
import accounts from './accounts.js';

const category = {
  createView(request, response) {
    const categoryId = request.params.id;
    const loggedInUser = accounts.getCurrentUser(request);
    if (!loggedInUser) {
      response.redirect('/');
      return;
    }

    logger.info('Category page loading ' + categoryId);

    const categoryData = gpuStore.getCategoryById(categoryId);

    if (!gpuStore.canViewCategory(categoryData, loggedInUser.id)) {
      response.status(404).send('Category not found');
      return;
    }

    const viewData = {
      title: categoryData.name,
      id: 'dashboard',
      fullname: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
      category: categoryData,
      gpus: categoryData.gpus,
      canEditCategory: gpuStore.canEditCategory(categoryData, loggedInUser.id),
    };

    response.render('category', viewData);
  },

  async addGpu(request, response) {
    const categoryId = request.params.id;
    const loggedInUser = accounts.getCurrentUser(request);
    if (!loggedInUser) {
      response.redirect('/');
      return;
    }

    const category = gpuStore.getCategoryById(categoryId);
    if (!gpuStore.canEditCategory(category, loggedInUser.id)) {
      response.redirect('/');
      return;
    }

    const { name, computePowerTF, powerWatts, vramGB, releaseDate } = request.body;
    if (name) {
      await gpuStore.addGpuToCategory(categoryId, {
        name,
        computePowerTF,
        powerWatts,
        vramGB,
        releaseDate,
      });
    }
    response.redirect(`/category/${categoryId}`);
  },

  async updateGpu(request, response) {
    const categoryId = request.params.id;
    const gpuId = request.params.gpuId;
    const loggedInUser = accounts.getCurrentUser(request);
    if (!loggedInUser) {
      response.redirect('/');
      return;
    }

    const category = gpuStore.getCategoryById(categoryId);
    if (!gpuStore.canEditCategory(category, loggedInUser.id)) {
      response.redirect('/');
      return;
    }

    const { name, computePowerTF, powerWatts, vramGB, releaseDate } = request.body;
    if (name) {
      await gpuStore.updateGpuInCategory(categoryId, gpuId, {
        name,
        computePowerTF,
        powerWatts,
        vramGB,
        releaseDate,
      });
    }
    response.redirect(`/category/${categoryId}`);
  },

  async deleteGpu(request, response) {
    const categoryId = request.params.id;
    const gpuId = request.params.gpuId;
    const loggedInUser = accounts.getCurrentUser(request);
    if (!loggedInUser) {
      response.redirect('/');
      return;
    }

    const category = gpuStore.getCategoryById(categoryId);
    if (!gpuStore.canEditCategory(category, loggedInUser.id)) {
      response.redirect('/');
      return;
    }

    await gpuStore.deleteGpuFromCategory(categoryId, gpuId);
    response.redirect(`/category/${categoryId}`);
  },
};

export default category;

