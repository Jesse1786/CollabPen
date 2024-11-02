import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import ProjectEntry from "../ProjectEntry/ProjectEntry";
import { useAuth } from "@/context/AuthProvider";

// Docs: https://mui.com/material-ui/react-dialog/
export default function ProjectPanel() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState([]);

  // Used for the add project pop-up form
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Get the user's projects from db and update the display
  const fetchProjects = async () => {
    const response = await fetch(
      `http://localhost:4000/api/users/${user}/projects`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    setProjects(data);
  };

  // Fetch projects once the user is loaded
  useEffect(() => {
    if (!loading && user) {
      fetchProjects();
    }
  }, [loading, user]);

  const handleDelete = async (id) => {
    const response = await fetch(
      `http://localhost:4000/api/users/${user}/projects/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );
    if (response.ok) {
      fetchProjects();
    }
  };

  // TODO: (med priority) Let user add others to a project. Also refactor project backend to track collaborators
  const handleGroupAction = async () => {
    console.log("Feature to add collaborators coming soon...");
  };

  // Add project pop-up form handlers
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setName("");
    setDescription("");
  };

  const handleAddProject = async () => {
    const response = await fetch(
      `http://localhost:4000/api/users/${user}/projects`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, description }),
      }
    );
    if (response.ok) {
      fetchProjects(); // Refresh the project list
      handleClose(); // Close the popup form
    }
  };

  // TODO: (med priority) Only allow the user to have x amount of projects unless they are a premium user
  return (
    <>
      <Box
        sx={{
          pl: 3,
          pb: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">Projects</Typography>
        <Button variant="contained" color="addButton" onClick={handleOpen}>
          <AddIcon sx={{ fontSize: 18, marginRight: "2px" }} />
          New project
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        {projects.map((project) => (
          <ProjectEntry
            key={project._id}
            id={project._id}
            name={project.name}
            description={project.description}
            onDelete={() => handleDelete(project._id)}
            onGroupAction={() => handleGroupAction()}
            onClick={() => router.push(`/project-workspace/${project._id}`)}
          />
        ))}
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            type="text"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Project Description"
            type="text"
            fullWidth
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{pb: 3, pr: 3}}>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={handleAddProject}
            color="addButton"
            variant="contained"
          >
            Add Project
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
