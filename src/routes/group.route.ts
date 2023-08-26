import express from "express";
import GroupController from "../controllers/group.controller";

const router = express.Router();

router.post('/:email', GroupController.createGroup);
router.post('/join/:email', GroupController.joinGroup);

export default router;