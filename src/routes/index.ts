import express from 'express';
import UserRoute from './user.route';

// Import route

// Create router
export const router = express.Router();

// Use route
router.use('/user', UserRoute);

export default router;