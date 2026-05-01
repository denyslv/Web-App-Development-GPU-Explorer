'use strict';

import logger from "../utils/logger.js";
import gpuStore from "../models/gpu-store.js";
import accounts from './accounts.js';

const start = {
  createView(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    if (!loggedInUser) {
      response.redirect('/');
      return;
    }

    logger.info("Start page loading!");

    const stats = gpuStore.getStats();

    const viewData = {
      title: "GPU Explorer",
      id: "welcome",
      stats: stats,
      fullname: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
    };

    viewData.stats = stats;
    response.render('start', viewData);
  },
};

export default start;
