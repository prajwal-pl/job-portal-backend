import express from "express";
import {
  addApplication,
  getApplicationById,
  getApplications,
} from "../controllers/application.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
const router = express.Router();

router.get("/", getApplications);
router.get("/:id", getApplicationById);
router.post("/new/:jobId", authenticateJWT, addApplication);

export default router;
