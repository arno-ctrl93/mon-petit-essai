import express from "express";
import testController from "../controllers/test.controller";


const router = express.Router();


router.post('/createOrUpdateMatches', testController.createOrUpdateMatches);
router.get('/fetchMatches', testController.fetchMatches);
router.patch('/closeMatches', testController.closeMatches);


export default router;