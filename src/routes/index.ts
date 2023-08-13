import express from 'express';
import UserRoute from './user.route';
import GroupRoute from './group.route';
import MatchRoute from './match.route';
import rugbyApiService from '../services/rugby-api.service';

// Import route

// Create router
export const router = express.Router();

// Use route
router.use('/user', UserRoute);
router.use('/group', GroupRoute);
router.use('/match', MatchRoute);
router.get('/matches', rugbyApiService.fetchMatches);

export default router;