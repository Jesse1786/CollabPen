import { Router } from "express";
import {
  createProject,
  addCollaborator,
  getProjects,
  getProject,
  getSharedProjects,
  updateProject,
  deleteProject,
} from "../controllers/projectController.mjs";

const projectsRouter = Router({ mergeParams: true });

// POST /api/users/:userId/projects
projectsRouter.post("/", createProject);

// POST /api/users/:userId/projects/:projectId/collaborators
projectsRouter.post("/:projectId/collaborators", addCollaborator);

// GET /api/users/:userId/projects
projectsRouter.get("/", getProjects);

// Get /api/users/:userId/projects/shared
projectsRouter.get("/shared", getSharedProjects);

// GET /api/users/:userId/projects/:projectId
projectsRouter.get("/:projectId", getProject);

// PATCH /api/users/:userId/projects/:projectId
projectsRouter.patch("/:projectId", updateProject);

// DELETE /api/users/:userId/projects/:projectId
projectsRouter.delete("/:projectId", deleteProject);

export default projectsRouter;
