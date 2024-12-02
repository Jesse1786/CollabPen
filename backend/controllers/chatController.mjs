import "dotenv/config";
import producer from "../utils/llmProducer.mjs";
import redisClient from "../redis/redis.mjs";
import llm from "../utils/llm.mjs";
import { Chat } from "../models/Chat.mjs";
import { Project } from "../models/Project.mjs";
import { Worker } from "bullmq";

const REDIS_HOST = process.env.REDIS_HOST || "localhost";

// Worker to process the LLM task queue
new Worker(
  "llm-queue",
  async (job) => {
    const { userId, projectId, query, messages } = job.data;

    try {
      // Invoke the LLM with the chat messages
      const response = await llm.invoke(
        messages.map(({ role, content }) => ({ role, content }))
      );

      if (!response) {
        const payload = { message: "LLM response is empty" };
        await redisClient.set(
          `chat:${userId}:${projectId}:${job.id}`,
          JSON.stringify(payload),
          "EX",
          3600
        ); // Cache for 1 hour
        return payload;
      }

      const botContent = response.content;

      // Save the assistant's response in the chat history
      const chat = await Chat.findOne({ userId, projectId });
      if (chat) {
        chat.messages.push({ role: "user", content: query });
        chat.messages.push({ role: "assistant", content: botContent });
        await chat.save();
      } else {
        const newChat = new Chat({
          userId,
          projectId,
          messages: [
            { role: "user", content: query },
            { role: "assistant", content: botContent },
          ],
        });
        await newChat.save();
      }

      const payload = { response: botContent };

      // Cache the response in Redis for quick access
      await redisClient.set(
        `chat:${userId}:${projectId}:${job.id}`,
        JSON.stringify(payload),
        "EX",
        3600
      ); // Cache for 1 hour

      return payload;
    } catch (error) {
      const payload = { message: "Server error" };
      await redisClient.set(
        `chat:${userId}:${projectId}:${job.id}`,
        JSON.stringify(payload),
        "EX",
        3600
      ); // Cache for 1 hour
      return payload;
    }
  },
  { connection: { host: REDIS_HOST, port: 6379 } }
);

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

    // Get the last 20 messages from the chat history
    const messages = chat.messages.slice(-20);

    // Add the job to the task queue
    const jobId = await producer(userId, projectId, query, messages);

    res.status(202).json({ message: "Query is being processed", jobId });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get the status of a query job
export const getJobStatus = async (req, res) => {
  try {
    const userId = req.params.userId;
    const projectId = req.params.projectId;
    const jobId = req.params.jobId;

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

    // Fetch the cached response from Redis
    const cachedResponse = await redisClient.get(
      `chat:${userId}:${projectId}:${jobId}`
    );

    if (cachedResponse) {
      const data = JSON.parse(cachedResponse);
      if (data.response) {
        res.status(200).json({ status: "completed", response: data.response });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    } else {
      res.status(202).json({ status: "processing" });
    }
  } catch (error) {
    console.log(error);
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
        role,
        content,
      };
    });
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
