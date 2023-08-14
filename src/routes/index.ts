import express from 'express';
import UserRoute from './user.route';
import GroupRoute from './group.route';
import MatchRoute from './match.route';
import BetRoute from './bet.route';
import TestRoute from './test.route';

// Import route

// Create router
export const router = express.Router();

// Use route
router.use('/user', UserRoute);
router.use('/group', GroupRoute);
router.use('/match', MatchRoute);
router.use('/bet', BetRoute);
router.use('/test', TestRoute);

export default router;