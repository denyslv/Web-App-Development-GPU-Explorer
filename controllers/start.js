'use strict';

import logger from "../utils/logger.js";

const start = {
  createView(request, response) {
    logger.info("Start page loading!");

    const viewData = {
      title: "GPU Explorer",
      id: "welcome",
    };

    response.render('start', viewData);
  },
};

export default start;
