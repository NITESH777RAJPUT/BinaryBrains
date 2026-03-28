import express from "express";
import {
  createProject,
  getProjectById,
  getProjects,
  updateProjectAssignment,
} from "../controllers/projectController.js";
import protect, { requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/", requireRole("admin", "member"), createProject);
router.get("/", getProjects);
router.patch("/:id/assignment", requireRole("admin", "member"), updateProjectAssignment);
router.get("/:id", getProjectById);

export default router;
