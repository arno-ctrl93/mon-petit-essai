import express from "express";
import matchController from "../controllers/match.controller";


const router = express.Router();


router.get('/fetchAndCreateOrUpdateMatches', matchController.fetchAndCreateOrUpdateMatches);
router.get('/fetchTodayPastAndNotClosedMatches', matchController.fetchTodayPastAndNotClosedMatches);
router.patch('/updateEndedMatches', matchController.updateEndedMatches);
router.get('/fetch-past-live-upcoming-matches/:email', matchController.fetchPastLiveUpcomingMatches);


export default router;