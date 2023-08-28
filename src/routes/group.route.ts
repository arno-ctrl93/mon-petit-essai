import express from "express";
import GroupController from "../controllers/group.controller";

const router = express.Router();

router.post('/:email', GroupController.createGroup);
router.post('/join/:email', GroupController.joinGroup);
router.get('/get-leaderboard-group/:uniqueId', GroupController.getLeaderboardGroup);

export default router;