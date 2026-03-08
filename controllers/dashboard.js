'use strict';

import logger from '../utils/logger.js';
import gpuStore from '../models/gpu-store.js';

const dashboard = {
  createView(request, response) {
    logger.info('Dashboard page loading');

    const categories = gpuStore.getCategories();

    const viewData = {
      title: 'GPU Dashboard',
      id: 'dashboard',
      categories: categories,
    };

    response.render('dashboard', viewData);
  },
};

export default dashboard;

