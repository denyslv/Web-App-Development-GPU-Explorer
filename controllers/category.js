'use strict';

import logger from '../utils/logger.js';
import gpuStore from '../models/gpu-store.js';

const category = {
  createView(request, response) {
    const categoryId = request.params.id;
    logger.info('Category page loading ' + categoryId);

    const categoryData = gpuStore.getCategoryById(categoryId);

    if (!categoryData) {
      response.status(404).send('Category not found');
      return;
    }

    const viewData = {
      title: categoryData.name,
      id: 'dashboard',
      category: categoryData,
      gpus: categoryData.gpus,
    };

    response.render('category', viewData);
  },
};

export default category;

