import express from "express";
import matchController from "../controllers/match.controller";


const router = express.Router();


router.get('/fetchAndCreateOrUpdateMatches', matchController.fetchAndCreateOrUpdateMatches);
router.get('/fetchTodayPastAndNotClosedMatches', matchController.fetchTodayPastAndNotClosedMatches);
router.patch('/updateEndedMatches', matchController.updateEndedMatches);


export default router;