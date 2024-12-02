import express from "express";
import usersRouter from "./usersRouter.mjs";
import authRouter from "./authRouter.mjs";
import projectsRouter from "./projectsRouter.mjs";
import chatsRouter from "./chatsRouter.mjs";

const mainRouter = express.Router();

mainRouter.use("/users", usersRouter);
mainRouter.use("/auth", authRouter);
mainRouter.use("/users/:userId/projects", projectsRouter);
mainRouter.use("/users/:userId/projects/:projectId/chat", chatsRouter);

export default mainRouter;
