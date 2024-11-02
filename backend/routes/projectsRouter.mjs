import { Router } from 'express';
import { createProject, getProject, getProjects, deleteProject } from '../controllers/projectController.mjs';

const projectsRouter = Router({ mergeParams: true });

// POST /api/users/:username/projects
projectsRouter.post("/", createProject);

// GET /api/users/:username/projects/:projectId
projectsRouter.get("/:projectId", getProject);

// GET /api/users/:username/projects
projectsRouter.get("/", getProjects);

// DELETE /api/users/:username/projects/:projectId
projectsRouter.delete("/:projectId", deleteProject);

export default projectsRouter;