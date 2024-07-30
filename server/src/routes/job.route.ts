import express from "express";

import { authenticateJWT } from "../middleware/auth.middleware";
import {
  addJob,
  deleteJob,
  getJobById,
  getJobs,
  updateJob,
} from "../controllers/job.controller";
const router = express.Router();

router.get("/", authenticateJWT, getJobs);
router.post("/new", authenticateJWT, addJob);
router.get("/:id", authenticateJWT, getJobById);
router.put("/update/:id", authenticateJWT, updateJob);
router.delete("/delete/:id", authenticateJWT, deleteJob);

export default router;
