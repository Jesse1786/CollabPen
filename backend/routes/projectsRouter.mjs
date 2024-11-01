import { Router } from 'express';
import { createProject, getProject, getProjects } from '../controllers/projectController.mjs';

const projectsRouter = Router({ mergeParams: true });

// POST /api/users/:username/projects
projectsRouter.post("/", createProject);

// GET /api/users/:username/projects/:projectId
projectsRouter.get("/:projectId", getProject);

// GET /api/users/:username/projects
projectsRouter.get("/", getProjects);

export default projectsRouter;