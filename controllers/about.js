'use strict';

import logger from '../utils/logger.js';
import gpuStore from '../models/gpu-store.js';

const about = {
  createView(request, response) {
    logger.info('About page loading');

    const stats = gpuStore.getStats();

    const author = {
      name: 'Denys',
      email: 'denys@example.com',
      company: 'SETU'
    };

    const viewData = {
      title: 'About',
      id: 'about',
      author: author,
      stats: stats,
    };

    response.render('about', viewData);
  },
};

export default about;

