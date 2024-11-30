import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    owner: { type: String, required: true }, // Email of the project owner
    name: { type: String, required: true },
    description: { type: String, required: true },
    ydoc: { type: String, required: true },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
