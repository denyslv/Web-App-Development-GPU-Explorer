'use strict';

import logger from '../utils/logger.js';
import accounts from './accounts.js';
import gpuStore from '../models/gpu-store.js';

const compare = {
  createView(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    if (!loggedInUser) {
      response.redirect('/');
      return;
    }

    logger.info('Compare page loading');

    const gpuOptions = gpuStore.getVisibleGpuOptions(loggedInUser.id);
    const selectedGpuAKey = request.query.gpuA || (gpuOptions[0] ? gpuOptions[0].key : '');
    const selectedGpuBKey = request.query.gpuB || (gpuOptions[1] ? gpuOptions[1].key : selectedGpuAKey);

    const selectedGpuA = gpuStore.getVisibleGpuByKey(selectedGpuAKey, loggedInUser.id);
    const selectedGpuB = gpuStore.getVisibleGpuByKey(selectedGpuBKey, loggedInUser.id);

    const viewData = {
      title: 'Compare GPUs',
      id: 'compare',
      fullname: `${loggedInUser.firstName} ${loggedInUser.lastName}`,
      gpuOptions,
      selectedGpuAKey,
      selectedGpuBKey,
      selectedGpuA,
      selectedGpuB,
      canCompare: Boolean(selectedGpuA && selectedGpuB),
    };

    response.render('compare', viewData);
  },
};

export default compare;
