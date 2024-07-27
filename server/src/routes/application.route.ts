import express from "express";
import {
  getApplicationById,
  getApplications,
} from "../controllers/application.controller";
const router = express.Router();

router.get("/", getApplications);
router.get("/:id", getApplicationById);

export default router;
