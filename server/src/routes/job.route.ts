import express from "express";
import { addJob, getJobById, getJobs } from "../controllers/main.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
const router = express.Router();

router.get("/jobs", authenticateJWT, getJobs);
router.post("/jobs/new", authenticateJWT, addJob);
router.get("/jobs/:id", authenticateJWT, getJobById);

export default router;
