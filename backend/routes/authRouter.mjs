import { Router } from 'express';
import { loginUser, logoutUser, checkAuth } from '../controllers/authController.mjs';

const authRouter = Router();

// POST /api/auth/login
authRouter.post("/login", loginUser);

// POST /api/auth/logout
authRouter.post("/logout", logoutUser);

// POST /api/auth/check
authRouter.post("/check", checkAuth);

export default authRouter;