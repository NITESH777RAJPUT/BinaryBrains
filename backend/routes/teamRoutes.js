import express from "express";
import {
  createTeam,
  getTeam,
  inviteToTeam,
  joinTeam,
  removeMember,
  updateMemberRole,
} from "../controllers/teamController.js";
import protect, { requireRole, requireTeam } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/create", createTeam);
router.post("/invite", requireTeam, requireRole("admin"), inviteToTeam);
router.post("/join", joinTeam);
router.get("/", getTeam);
router.post("/remove-member", requireTeam, requireRole("admin"), removeMember);
router.post("/update-role", requireTeam, requireRole("admin"), updateMemberRole);

export default router;
