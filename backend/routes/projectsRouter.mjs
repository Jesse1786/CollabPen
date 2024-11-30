import { Router } from "express";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.mjs";

const projectsRouter = Router({ mergeParams: true });

// POST /api/users/:id/projects
projectsRouter.post("/", createProject);

// GET /api/users/:id/projects
projectsRouter.get("/", getProjects);

// GET /api/users/:id/projects/:projectId
projectsRouter.get("/:projectId", getProject);

// PATCH /api/users/:id/projects/:projectId
projectsRouter.patch("/:projectId", updateProject);

// DELETE /api/users/:id/projects/:projectId
projectsRouter.delete("/:projectId", deleteProject);

export default projectsRouter;
