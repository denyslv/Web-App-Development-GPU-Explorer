'use strict';

import logger from '../utils/logger.js';
import gpuStore from '../models/gpu-store.js';
import accounts from './accounts.js';

const about = {
  createView(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    if (!loggedInUser) {
      response.redirect('/');
      return;
    }

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
      fullname: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
      author: author,
      stats: stats,
    };

    response.render('about', viewData);
  },
};

export default about;

