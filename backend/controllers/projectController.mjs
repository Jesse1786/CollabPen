import * as Y from "yjs";
import { encode as base64Encode } from "base64-arraybuffer";
import { Project } from "../models/Project.mjs";
import { User } from "../models/User.mjs";

const MAX_COLLABORATORS = 5;

// Check if the user is a collaborator of the project
const isCollaborator = (project, userId) => {
  return project.collaborators.some(
    (collaborator) => collaborator.user.toString() === userId
  );
};

// Create a new project
// TODO: Import placeholders for html, css, and js
export const createProject = async (req, res) => {
  try {
    const owner = req.params.userId;
    const { name, description } = req.body;

    // Check if user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    // Check if the email of the authenticated user matches the owner
    if (req.user.id !== owner) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Create a new ydoc and store it as a string
    const ydoc = new Y.Doc();
    ydoc.getText("html").insert(0, "");
    ydoc.getText("css").insert(0, "");
    ydoc.getText("js").insert(0, "");

    const ydocUpdate = Y.encodeStateAsUpdate(ydoc);
    // Convert the Uint8Array to a base64-encoded string to store in the database
    const ydocBase64 = base64Encode(ydocUpdate);

    const project = new Project({
      owner,
      name,
      description,
      ydoc: ydocBase64,
    });

    await project.save();

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add a collaborator to a project
export const addCollaborator = async (req, res) => {
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
    if (project.owner.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check that the collaborator is not the owner
    if (collaborator._id.toString() === userId) {
      return res.status(409).json({ message: "Cannot share with owner" });
    }

    // Check if the collaborator is already a collaborator of the project
    if (isCollaborator(project, collaborator._id.toString())) {
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

    // Check if the id of the authenticated user matches the userId
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if the user is the owner or a collaborator of the project
    if (
      project.owner.toString() !== userId &&
      !isCollaborator(project, userId)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({ ydoc: project.ydoc });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a project given its id
export const updateProject = async (req, res) => {
  try {
    const userId = req.params.userId;
    const projectId = req.params.projectId;
    const { name, description, ydoc } = req.body;

    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Access denied" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if the user is the owner or a collaborator of the project
    if (
      project.owner.toString() !== userId &&
      !isCollaborator(project, userId)
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // All fields are optional
    project.name = name || project.name;
    project.description = description || project.description;
    project.ydoc = ydoc || project.ydoc;

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
    if (project.owner.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    await Project.findByIdAndDelete(projectId);

    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
