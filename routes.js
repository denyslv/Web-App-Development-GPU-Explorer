'use strict';

import express from 'express';
const router = express.Router();

import start from './controllers/start.js';
import dashboard from './controllers/dashboard.js';
import category from './controllers/category.js';
import about from './controllers/about.js';

router.get('/', start.createView);
router.get('/dashboard', dashboard.createView);
router.get('/category/:id', category.createView);
router.get('/about', about.createView);


export default router;
