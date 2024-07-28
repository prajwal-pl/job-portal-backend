import { Router } from "express";
import { getUserById, login, register } from "../controllers/main.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = Router();

router.get("/:id", authenticateJWT, getUserById);
router.post("/register", register);
router.post("/login", login);

export default router;
