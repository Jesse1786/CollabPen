import { Router } from 'express';
import { createUser, getUser } from '../controllers/userController.mjs';

const usersRouter = Router();

// POST /api/users
usersRouter.post("/", createUser);

// GET /api/users/:userId
usersRouter.get("/:userId", getUser);

export default usersRouter;