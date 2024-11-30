import express from "express";
import usersRouter from "./usersRouter.mjs";
import authRouter from "./authRouter.mjs";
import projectsRouter from "./projectsRouter.mjs";

const mainRouter = express.Router();

mainRouter.use("/users", usersRouter);
mainRouter.use("/auth", authRouter);
mainRouter.use("/users/:userId/projects", projectsRouter);

export default mainRouter;
