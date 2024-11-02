import { Router } from 'express';
import { createProject, getProjects, getProject, updateProject, deleteProject } from '../controllers/projectController.mjs';

const projectsRouter = Router({ mergeParams: true });

// POST /api/users/:username/projects
projectsRouter.post("/", createProject);

// GET /api/users/:username/projects
projectsRouter.get("/", getProjects);

// GET /api/users/:username/projects/:projectId
projectsRouter.get("/:projectId", getProject);

// PATCH /api/users/:username/projects/:projectId
projectsRouter.patch("/:projectId", updateProject);

// DELETE /api/users/:username/projects/:projectId
projectsRouter.delete("/:projectId", deleteProject);

export default projectsRouter;