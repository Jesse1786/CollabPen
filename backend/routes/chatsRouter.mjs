import { Router } from "express";
import { processQuery } from "../controllers/chatsController.mjs";

const chatsRouter = Router({ mergeParams: true });

// POST /api/users/:userId/projects/:projectId/chat
chatsRouter.post("/", processQuery);

export default chatsRouter;
