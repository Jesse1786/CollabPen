import "dotenv/config";
import mongoose from "mongoose";

const USERNAME = process.env.MONGO_USERNAME;
const PASSWORD = process.env.MONGO_PASSWORD;
const DATABASE = process.env.MONGO_DATABASE;
const HOST = process.env.ENV === "prod" ? "db" : "localhost";

if (!USERNAME || !PASSWORD || !DATABASE) {
  console.error("MongoDB environment variables are not set.");
  process.exit(1);
}

const MONGO_URI = `mongodb://${USERNAME}:${PASSWORD}@${HOST}:27017/${DATABASE}?authSource=admin`;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error}`);
    process.exit(1);
  }
};
