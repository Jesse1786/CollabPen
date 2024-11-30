import "dotenv/config";
import passport from "passport";

const FRONTEND_URL =
  process.env.ENV === "prod"
    ? process.env.FRONTEND_URL || "http://localhost:3000"
    : "http://localhost:3000";

// Log in the user.
// Custom callback is provided to passport.authenticate in case we want to customize error codes
export const loginUser = (req, res) => {
  passport.authenticate("local", (err, user) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!user) return res.status(401).json({ message: "Access denied" });

    // Need to call req.logIn manually since we are using a custom callback
    // This serializes the user's id in req.session.passport.user
    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ authenticated: false });
      return res
        .status(200)
        .json({ authenticated: true, email: user.email, id: user._id });
    });
  })(req, res); // Invoke to make it run immediately
};

export const oauthGoogle = (req, res) => {
  passport.authenticate("google", {
    scope: ["email", "profile"],
    prompt: "select_account",
  })(req, res);
};

export const oauthGoogleCallback = (req, res) => {
  passport.authenticate("google", (err, user) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!user) return res.status(401).json({ message: "Access denied" });

    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ authenticated: false });
      return res.redirect(FRONTEND_URL);
    });
  })(req, res);
};

// Log out the user
export const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout error" });
    req.session.destroy((err) => {
      if (err)
        return res.status(500).json({ message: "Error clearing session" });
      res.clearCookie("connect.sid"); // Clear cookies so outdated session is not used
      return res.status(200).json({ message: "Logout successful" });
    });
  });
};

// Check if the user is logged in. Returns user info if authenticated
export const checkAuth = (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({
      authenticated: true,
      email: req.user.email,
      id: req.user._id,
    });
  } else {
    res.status(401).json({ authenticated: false });
  }
};
