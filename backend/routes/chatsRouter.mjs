import { Router } from "express";
import {
  processQuery,
  getChatHistory,
} from "../controllers/chatController.mjs";

const chatsRouter = Router({ mergeParams: true });

// POST /api/users/:userId/projects/:projectId/chat
chatsRouter.post("/", processQuery);

// GET /api/users/:userId/projects/:projectId/chat
chatsRouter.get("/", getChatHistory);

export default chatsRouter;
