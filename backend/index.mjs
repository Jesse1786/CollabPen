import express from "express";
import { createServer } from "http";
import { connectDB } from "./db/db.mjs";
import mainRouter from "./routes/mainRouter.mjs";

const app = express();
const server = createServer(app); // Need to use http server for socket.io
const PORT = 4000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use("/api", mainRouter); // Routes handling

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
