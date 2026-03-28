import express from "express";
import { createTimeLog, getTimeLogsByProject } from "../controllers/timelogController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/", createTimeLog);
router.get("/:projectId", getTimeLogsByProject);

export default router;

