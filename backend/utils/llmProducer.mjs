import "dotenv/config";
import { Queue } from "bullmq";

const REDIS_HOST = process.env.REDIS_HOST || "localhost";

const llmQueue = new Queue("llm-queue", {
  connection: {
    host: REDIS_HOST,
    port: 6379,
    maxRetriesPerRequest: null,
  },
});

const producer = async (userId, projectId, query, messages) => {
  const job = await llmQueue.add("invoke", {
    userId,
    projectId,
    query,
    messages,
  });

  return job.id;
};

export default producer;
