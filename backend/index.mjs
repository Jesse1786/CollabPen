// NPM imports
import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";

// Local imports
import "dotenv/config";
import { createServer } from "http";
import { connectDB } from "./db/db.mjs";
import mainRouter from "./routes/mainRouter.mjs";
import setUpLocalStrategy from "./passport/localStrategy.mjs";
import setUpGoogleStrategy from "./passport/googleStrategy.mjs";

const app = express();
const server = createServer(app);
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

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

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
setUpGoogleStrategy(); // Passport Google strategy

app.use("/api", mainRouter); // Routes handling

server.listen(PORT, (err) => {
  if (err) console.log(err);
  else console.log(`Server is running on port ${PORT}`);
});
