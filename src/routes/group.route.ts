import express from "express";
import GroupController from "../controllers/group.controller";

const router = express.Router();

router.post('/:email', GroupController.createGroup);


export default router;