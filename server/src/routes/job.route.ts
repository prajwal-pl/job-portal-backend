import express from "express";
import { addJob, getJobs } from "../controllers/job.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
const router = express.Router();

router.get("/jobs", authenticateJWT, getJobs);
router.post("/jobs/new", authenticateJWT, addJob);

export default router;
