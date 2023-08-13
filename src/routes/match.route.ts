import express from "express";
import matchController from "../controllers/match.controller";


const router = express.Router();


router.get('/fetchAndCreateOrUpdateMatches', matchController.fetchAndCreateOrUpdateMatches);


export default router;