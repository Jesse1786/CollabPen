import express from "express";
import { createServer } from "http";
import { connectDB } from "./db/db.mjs";
import { User } from "./models/User.mjs";

const app = express();
const server = createServer(app); // Need to use http server for socket.io
const PORT = 4000;

app.use(express.json());

// Connect to MongoDB
connectDB();

app.get("/", (req, res) => {
    res.send("Server working.");
});

app.post("/users", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json(user);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
})

app.get("/users/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        res.status(200).json(user);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
});


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


