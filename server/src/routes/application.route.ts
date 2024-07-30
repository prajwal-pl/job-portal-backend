import express from "express";
import {
  addApplication,
  deleteApplication,
  getApplicationById,
  getApplications,
  scheduleInterview,
} from "../controllers/application.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
const router = express.Router();

router.get("/:id", getApplications);
router.delete("/:id", authenticateJWT, deleteApplication);
router.get("/:id/schedule", authenticateJWT, scheduleInterview);
router.get("/application/:id", getApplicationById);
router.post("/new/:jobId", authenticateJWT, addApplication);

export default router;
