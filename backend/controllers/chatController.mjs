import { ChatOpenAI } from "@langchain/openai";
import { Chat } from "../models/Chat.mjs";
import { Project } from "../models/Project.mjs";

// LLM instance
const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
});

// Check if the user is a collaborator of the project
const isCollaborator = (project, userId) => {
  return project.collaborators.some(
    (collaborator) => collaborator.user.toString() === userId
  );
};

// Process a chat query from the user
export const processQuery = async (req, res) => {
  try {
    const userId = req.params.userId;
    const projectId = req.params.projectId;
    const query = req.body.query;

    // Check if user is authenticated
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

    // Make sure query is non-empty
    if (!query) {
      return res.status(422).json({ message: "Query cannot be empty" });
    }

    // Find the chat history for the user on the project
    const chat = await Chat.findOne({ userId, projectId });

    chat.messages.push({ role: "user", content: query });

    // Invoke the LLM with the chat messages
    const response = await llm.invoke(
      chat.messages.map(({ role, content }) => {
        return {
          role,
          content,
        };
      })
    );

    const botContent = response.content;

    chat.messages.push({ role: "assistant", content: botContent });

    // Only save both the query and response after receiving a response
    await chat.save();

    res.status(200).json({ response: botContent });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get the chat history for a user on a project
export const getChatHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const projectId = req.params.projectId;
    // Check if user is authenticated
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
    const chat = await Chat.findOne({ userId, projectId });
    const messages = chat.messages.map(({ role, content }) => {
      return {
        id: Math.random().toString(36).substr(2, 9),
        role,
        content,
      };
    });
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
