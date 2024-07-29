import { Router } from "express";
import {
  getUser,
  getUserById,
  login,
  logout,
  register,
} from "../controllers/main.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = Router();

router.get("/:id", authenticateJWT, getUserById);
router.get("/user/:id", authenticateJWT, getUser);
router.post("/register", register);
router.post("/login", login);
router.post("/logout", authenticateJWT, logout);

export default router;
