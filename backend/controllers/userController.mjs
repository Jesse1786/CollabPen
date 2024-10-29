import { User } from "../models/User.mjs";

// TODO: store salted hash of password
export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = new User({ name, email, password });
        await user.save();
        res.status(201).json(user);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        res.status(200).json(user);
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}