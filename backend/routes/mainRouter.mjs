import express from "express";
import usersRouter from "./usersRouter.mjs";

const mainRouter = express.Router();

mainRouter.use('/users', usersRouter);

export default mainRouter;