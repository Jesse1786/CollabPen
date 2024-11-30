import { Router } from "express";
import {
  createProject,
  shareProject,
  getProjects,
  getProject,
  getSharedProjects,
  updateProject,
  deleteProject,
} from "../controllers/projectController.mjs";

const projectsRouter = Router({ mergeParams: true });

// POST /api/users/:id/projects
projectsRouter.post("/", createProject);

// POST /api/users/:id/projects/share
projectsRouter.post("/share", shareProject);

// GET /api/users/:id/projects
projectsRouter.get("/", getProjects);

// Get /api/users/:id/projects/shared
projectsRouter.get("/shared", getSharedProjects);

// GET /api/users/:id/projects/:projectId
projectsRouter.get("/:projectId", getProject);

// PATCH /api/users/:id/projects/:projectId
projectsRouter.patch("/:projectId", updateProject);

// DELETE /api/users/:id/projects/:projectId
projectsRouter.delete("/:projectId", deleteProject);

export default projectsRouter;
