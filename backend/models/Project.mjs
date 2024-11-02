import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    owner: { type: String, required: true }, // Username of the project owner
    name: { type: String, required: true },
    description: { type: String, required: true },
    html: { type: String, default: '' },
    css: { type: String, default: '' },
    js: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Project = mongoose.model('Project', projectSchema);
