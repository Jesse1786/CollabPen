import "dotenv/config";
import Redis from "ioredis";

const REDIS_HOST = process.env.REDIS_HOST || "localhost";

const redisClient = new Redis({
  host: REDIS_HOST,
  port: 6379,
});

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis error:", err);
  process.exit(1);
});

export default redisClient;
