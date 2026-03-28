import express from "express";
import { createProject, getProjectById, getProjects } from "../controllers/projectController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);

export default router;

