import express from 'express';
import UserRoute from './user.route';
import GroupRoute from './group.route';
import rugbyApiRepository from '../repositories/rugby-api.repository';

// Import route

// Create router
export const router = express.Router();

// Use route
router.use('/user', UserRoute);
router.use('/group', GroupRoute);
router.get('/matches', rugbyApiRepository.fetchMatches);

export default router;