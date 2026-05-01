'use strict';

import express from 'express';
const router = express.Router();

import start from './controllers/start.js';
import dashboard from './controllers/dashboard.js';
import category from './controllers/category.js';
import about from './controllers/about.js';
import accounts from './controllers/accounts.js';
import compare from './controllers/compare.js';

router.get('/', accounts.index);
router.get('/login', accounts.login);
router.get('/signup', accounts.signup);
router.get('/logout', accounts.logout);
router.post('/register', accounts.register);
router.post('/authenticate', accounts.authenticate);
router.get('/start', start.createView);
router.get('/dashboard', dashboard.createView);
router.post('/dashboard/category', dashboard.addCategory);
router.post('/dashboard/category/:id/delete', dashboard.deleteCategory);
router.post('/dashboard/gpu', dashboard.addGpu);
router.post('/dashboard/gpu/update', dashboard.updateGpu);
router.post('/dashboard/gpu/delete', dashboard.deleteGpu);
router.get('/category/:id', category.createView);
router.post('/category/:id/gpu', category.addGpu);
router.post('/category/:id/gpu/:gpuId/update', category.updateGpu);
router.post('/category/:id/gpu/:gpuId/delete', category.deleteGpu);
router.get('/about', about.createView);
router.get('/compare', compare.createView);


export default router;
