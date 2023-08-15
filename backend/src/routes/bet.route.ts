import express from "express";
import BetController from "../controllers/bet.controller";


const router = express.Router();

router.post('/:email', BetController.createOrUpdateBet);

export default router;