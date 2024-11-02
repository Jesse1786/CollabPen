import React, { useState, useEffect } from "react";
import { Box, Button, List, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import ProjectEntry from "../ProjectEntry/ProjectEntry";
import { useAuth } from "@/context/AuthProvider";

export default function ProjectPanel() {
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    const response = await fetch(
      `http://localhost:4000/api/users/${user}/projects`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    const data = await response.json();
    console.log(user);
    console.log(data);
    setProjects(data);
  };

  useEffect(() => {
    if (!loading && user) {
      fetchProjects();
    }
  }, [user, loading]);

  const handleDelete = async (id) => {
    console.log("Trying to delete project with id: ", id);
    console.log("User: ", user);
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

  const handleGroupAction = async () => {
    console.log("Feature to add collaborators coming soon...");
  };

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
        <Button variant="contained" color="addButton">
          <AddIcon sx={{ fontSize: 18, marginRight: "2px" }} />
          New project
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        {projects.map((project) => (
          <ProjectEntry
            key={project._id}
            name={project.name}
            description={project.description}
            onDelete={() => handleDelete(project._id)}
            onGroupAction={() => handleGroupAction()}
          />
        ))}
      </Box>
    </>
  );
}
