import express from "express";
import { analyzeProjectData } from "../controllers/aiController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/analyze", analyzeProjectData);

export default router;

