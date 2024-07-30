import { Router } from "express";
import {
  getUser,
  getUserById,
  login,
  logout,
  register,
  updateRole,
} from "../controllers/main.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = Router();

router.get("/:id", authenticateJWT, getUserById);
router.get("/user/:id", authenticateJWT, getUser);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/update-role/:id", authenticateJWT, updateRole);

export default router;
