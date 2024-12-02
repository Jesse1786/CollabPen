import "dotenv/config";
import { Worker } from "bullmq";
import redisClient from "../redis/redis.mjs";
import llm from "./llm.mjs";
import { Chat } from "../models/Chat.mjs";

const REDIS_HOST = process.env.REDIS_HOST || "localhost";

// Worker to process the task queue
new Worker(
  "llm-queue",
  async (job) => {
    const { userId, projectId, query, messages } = job.data;

    const llmMessages = messages.map(({ role, content }) => ({
      role,
      content,
    }));

    llmMessages.push({ role: "user", content: query });

    try {
      // Invoke the LLM with the chat messages
      const response = await llm.invoke(llmMessages);

      if (!response) {
        throw new Error("LLM response is empty");
      }

      const botContent = response.content;

      // Save the assistant's response in the chat history
      const chat = await Chat.findOne({ userId, projectId });
      if (chat) {
        chat.messages.push({ role: "user", content: query });
        chat.messages.push({ role: "assistant", content: botContent });
        await chat.save();
      }

      // Cache the response in Redis for quick access
      await redisClient.set(
        `chat:${userId}:${projectId}:${job.id}`,
        botContent,
        "EX",
        3600
      ); // Cache for 1 hour

      return { response: botContent };
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  { connection: { host: REDIS_HOST, port: 6379 } }
);
