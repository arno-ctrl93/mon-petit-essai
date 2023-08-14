import express from "express";
import schedulerController from "../controllers/scheduler.controller";


const router = express.Router();

router.post('/schedule-task', schedulerController.scheduleTask);
router.delete('/unschedule-task', schedulerController.unscheduleTask);

export default router;