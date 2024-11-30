import { Router } from "express";
import {
  loginUser,
  logoutUser,
  checkAuth,
  oauthGoogleCallback,
  oauthGoogle,
} from "../controllers/authController.mjs";

const authRouter = Router();

// POST /api/auth/login
authRouter.post("/login", loginUser);

// GET /api/auth/google
authRouter.get("/google", oauthGoogle);

// GET /api/auth/google/callback
authRouter.get("/google/callback", oauthGoogleCallback);

// POST /api/auth/logout
authRouter.post("/logout", logoutUser);

// GET /api/auth/check
authRouter.get("/check", checkAuth);

export default authRouter;
