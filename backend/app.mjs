import { createServer } from "http";
import express from "express";
import { Server } from "socket.io";
import cors from "cors";

const PORT = 4000;
const app = express();
const server = createServer(app);

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(express.json());
app.use(cors(corsOptions));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

let room = "test room";

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);
  socket.join(room);

  socket.on("disconnect", () => {
    console.log(`user disconnected: ${socket.id}`);
  });

  // Emit HTML changes to all users in the room
  socket.on("send-delta-html", (delta) => {
    console.log("delta:", delta);
    io.to(room).emit("receive-delta-html", delta);
  });

  // Emit CSS changes to all users in the room
  socket.on("send-delta-css", (delta) => {
    console.log("delta:", delta);
    io.to(room).emit("receive-delta-css", delta);
  });

  // Emit JS changes to all users in the room
  socket.on("send-delta-js", (delta) => {
    console.log("delta:", delta);
    io.to(room).emit("receive-delta-js", delta);
  });
});

server.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log("HTTP server on http://localhost:%s", PORT);
});
