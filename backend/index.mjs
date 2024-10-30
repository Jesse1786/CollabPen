// NPM imports
import express from "express";
import session from "express-session";
import passport from "passport";

// Local imports
import { createServer } from "http";
import { connectDB } from "./db/db.mjs";
import mainRouter from "./routes/mainRouter.mjs";
import setUpLocalStrategy from "./passport/localStrategy.mjs";

const app = express();
const server = createServer(app); // Need to use http server for socket.io
const PORT = 4000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// TODO: (low priority) Add security features such as HttpOnly, Secure, SameSite. But first get MVP working.
app.use(session({
  secret: "fat fluffy cats",
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  }
}));

app.use(passport.initialize());
app.use(passport.session());
setUpLocalStrategy(); // Passport local strategy

app.use("/api", mainRouter); // Routes handling

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
