import passport from 'passport';

// Log in the user.
// Custom callback is provided to passport.authenticate in case we want to customize error codes
export const loginUser = (req, res) => {
  passport.authenticate('local', (err, user) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!user) return res.status(401).json({ message: "Access denied" });

    // Need to call req.logIn manually since we are using a custom callback
    // This serializes the user's id in req.session.passport.user
    req.logIn(user, (err) => {
      if (err) return res.status(500).json({ message: "Server error" });
      return res.status(200).json({ message: "Login successful" });
    });
  })(req, res); // Invoke to make it run immediately
};

// Log out the user
export const logoutUser = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout error" });
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ message: "Error clearing session" });
      res.clearCookie('connect.sid'); // Clear cookies so outdated session is not used
      return res.status(200).json({ message: "Logout successful" });
    });
  });
};

// Check if the user is logged in
export const checkAuth = (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ message: "Access granted" });
  } else {
    res.status(401).json({ message: "Access denied" });
  }
};