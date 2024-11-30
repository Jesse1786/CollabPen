import { Project } from "../models/Project.mjs";
import * as Y from "yjs";
import { encode as base64Encode } from 'base64-arraybuffer';

// Create a new project
// TODO: Import placeholders for html, css, and js
export const createProject = async (req, res) => {
  try {
    const owner = req.params.userId;
    const { name, description } = req.body;

    // Check if user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Access denied" });
    }

    // Check if the email of the authenticated user matches the owner of the project
    if (req.user.id !== owner) {
      return res.status(401).json({ message: "Access denied" });
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
    res.status(500).json({ message: error.message });
  }
};

// Get all of the user's projects
export const getProjects = async (req, res) => {
  try {
    const owner = req.params.userId;

    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Access denied" });
    }

    // Check if the id of the authenticated user matches the owner of the project
    if (req.user.id !== owner) {
      return res.status(401).json({ message: "Access denied" });
    }

    const projects = await Project.find({ owner }).sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a project given its id
export const getProject = async (req, res) => {
  try {
    const owner = req.params.userId;
    const projectId = req.params.projectId;

    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Access denied" });
    }

    // TODO: Check if the email of the authenticated user matches the owner of the project or collaborator
    // if (req.user.id !== owner) {
    //   return res.status(401).json({ message: "Access denied" });
    // }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // // Deserialize the string into a ydoc
    // const data = JSON.parse(project.ydoc);
    // const ydoc = new Y.Doc();
    // ydoc.getText("html").insert(0, data.html || "");
    // ydoc.getText("css").insert(0, data.css || "");
    // ydoc.getText("js").insert(0, data.js || "");

    res.status(200).json({ ydoc: project.ydoc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a project given its id
export const updateProject = async (req, res) => {
  try {
    const owner = req.params.userId;
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

    // TODO: Get list of collaborators of the project

    // TODO: Check if the authenticated user is the owner or a collaborator of the project
    // if (req.user.email !== owner) {
    //   return res.status(401).json({ message: "Access denied" });
    // }

    // All fields are optional
    project.name = name || project.name;
    project.description = description || project.description;
    project.ydoc = ydoc || project.ydoc;

    await project.save();

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a project given its id
export const deleteProject = async (req, res) => {
  try {
    const owner = req.params.userId;
    const projectId = req.params.projectId;

    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Access denied" });
    }

    // Check if the id of the authenticated user matches the owner of the project
    if (req.user.id !== owner) {
      return res.status(401).json({ message: "Access denied" });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await Project.findByIdAndDelete(projectId);

    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
