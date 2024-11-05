import bcrypt from "bcrypt";
import { User } from "../models/User.mjs";

export const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Use bcrypt to hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Store the hashed password
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// For testing purposes, remove in actual application
export const getUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
