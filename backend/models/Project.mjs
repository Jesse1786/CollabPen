import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // User id of the project owner
    name: { type: String, required: true },
    description: { type: String, required: true },
    collaborators: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        sharedAt: { type: Date, default: Date.now },
      },
    ],
    ydoc: { type: String, required: true }, // Stores a base64-encoded string
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);