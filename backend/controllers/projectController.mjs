import { Project } from "../models/Project.mjs";

const MAX_COLLABORATORS = 5;

// Check if the user is a collaborator of the project
const isCollaborator = (project, userId) => {
  return project.collaborators.some(
    (collaborator) => collaborator.user.toString() === userId.toString()
  );
};

// Create a new project
// TODO: Import placeholders for html, css, and js
export const createProject = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, description, html, css, js } = req.body;

    // Check if user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    // Check if the email of the authenticated user matches the userId
    if (req.user.id !== owner) {
      return res.status(403).json({ message: "Access denied" });
    }

    const project = new Project({ owner, name, description, html, css, js });
    await project.save();

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Share a project with another user
export const shareProject = async (req, res) => {
  try {
    const userId = req.params.userId;
    const projectId = req.params.projectId;
    const collaboratorEmail = req.body.email;

    if (!collaboratorEmail) {
      return res
        .status(422)
        .json({ message: "Collaborator email is required" });
    }

    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    // Check if the id of the authenticated user matches the userId
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const collaborator = await User.findOne({ email: collaboratorEmail });

    if (!collaborator) {
      return res
        .status(404)
        .json({ message: `User with email ${collaboratorEmail} not found` });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if the user is the owner
    if (project.owner !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check that the collaborator is not the owner
    if (collaborator._id === userId) {
      return res.status(409).json({ message: "Cannot share with owner" });
    }

    // Check if the collaboratorId is already a collaborator of the project
    if (isCollaborator(project, collaborator._id)) {
      return res.status(409).json({ message: "Already a collaborator" });
    }

    // Check if the project has reached the maximum number of collaborators
    if (project.collaborators.length >= MAX_COLLABORATORS) {
      return res
        .status(422)
        .json({ message: "Maximum collaborators reached for project" });
    }

    project.collaborators.push({
      user: collaborator._id,
      sharedAt: new Date(),
    });
    await project.save();

    res.status(200).json("Project shared successfully");
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all of the user's projects
export const getProjects = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    // Check if the id of the authenticated user matches the userId
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const projects = await Project.find({ owner: userId }).sort({
      createdAt: -1,
    });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getSharedProjects = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    // Check if the id of the authenticated user matches the userId
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Find all projects where the user is a collaborator, sorted by the most recently shared
    const projects = await Project.find({
      "collaborators.user": userId,
    }).sort({ "collaborators.sharedAt": -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get a project given its id
export const getProject = async (req, res) => {
  try {
    const userId = req.params.userId;
    const projectId = req.params.projectId;

    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    // Check if the email of the authenticated user matches the userId
    if (req.user.id !== owner) {
      return res.status(403).json({ message: "Access denied" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if the user is the owner or a collaborator of the project
    if (project.owner !== userId && !isCollaborator(project, userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a project given its id
export const updateProject = async (req, res) => {
  try {
    const owner = req.params.userId;
    const projectId = req.params.projectId;
    const { name, description, html, css, js } = req.body;

    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Access denied" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if the user is the owner or a collaborator of the project
    if (project.owner !== userId && !isCollaborator(project, userId)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // TODO: Get list of collaborators of the project

    // TODO: Check if the authenticated user is the owner or a collaborator of the project
    // if (req.user.email !== owner) {
    //   return res.status(401).json({ message: "Access denied" });
    // }

    // All fields are optional
    project.name = name || project.name;
    project.description = description || project.description;
    project.html = html || project.html;
    project.css = css || project.css;
    project.js = js || project.js;

    await project.save();

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a project given its id
export const deleteProject = async (req, res) => {
  try {
    const userId = req.params.userId;
    const projectId = req.params.projectId;

    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Access denied" });
    }

    // Check if the id of the authenticated user matches the userId
    if (req.user.id !== userId) {
      return res.status(401).json({ message: "Access denied" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if the user is the owner
    if (project.owner !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Project.findByIdAndDelete(projectId);

    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
