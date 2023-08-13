import express from 'express';
import UserRoute from './user.route';
import GroupRoute from './group.route';

// Import route

// Create router
export const router = express.Router();

// Use route
router.use('/user', UserRoute);
router.use('/group', GroupRoute);

export default router;