import express from "express";
import { createTimeLog, getAllTimeLogs, getTimeLogsByProject } from "../controllers/timelogController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/", createTimeLog);
router.get("/", getAllTimeLogs);
router.get("/:projectId", getTimeLogsByProject);

export default router;
