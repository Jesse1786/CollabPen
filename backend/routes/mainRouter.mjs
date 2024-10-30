import express from "express";
import usersRouter from "./usersRouter.mjs";
import authRouter from "./authRouter.mjs";

const mainRouter = express.Router();

mainRouter.use('/users', usersRouter);
mainRouter.use('/auth', authRouter);

export default mainRouter;