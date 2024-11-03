// NPM imports
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import { Server } from "socket.io";

// Local imports
import "dotenv/config";
import { createServer } from "http";
import { connectDB } from "./db/db.mjs";
import mainRouter from "./routes/mainRouter.mjs";
import setUpLocalStrategy from "./passport/localStrategy.mjs";

const app = express();
const server = createServer(app); // Need to use http server for socket.io
const PORT = 4000;

const FRONTEND_URL =
  process.env.ENV === "prod"
    ? process.env.FRONTEND_URL || "http://localhost:3000"
    : "http://localhost:3000";

// CORS options
const corsOptions = {
  origin: FRONTEND_URL,
  credentials: true,
};

// Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// TODO: (low priority) Add security features such as HttpOnly, Secure, SameSite. But first get MVP working.
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
setUpLocalStrategy(); // Passport local strategy

app.use("/api", mainRouter); // Routes handling

// Temporary room for testing
let room = "test room";

// Socket.io connection
io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);
  socket.join(room);

  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.id}`);
  });

  // Emit HTML changes to all users in the room
  socket.on("send-delta-html", (delta) => {
    socket.to(room).emit("receive-delta-html", delta);
  });

  // Emit CSS changes to all users in the room
  socket.on("send-delta-css", (delta) => {
    socket.to(room).emit("receive-delta-css", delta);
  });

  // Emit JS changes to all users in the room
  socket.on("send-delta-js", (delta) => {
    socket.to(room).emit("receive-delta-js", delta);
  });
});

server.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Server is running on port ${PORT}`);
});
