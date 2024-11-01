import React, { useState, useEffect } from "react";
import { Box, Button, List, Typography } from "@mui/material";
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
    // const response = await fetch(`http://localhost:8000/api/user/:username/projects/${id}`, {
    //   method: "DELETE",
    // });
    // if (response.ok) {
    //   fetchProjects();
    // }
    console.log("Deleting project with id: ", id);
  };

  const handleGroupAction = async () => {
    console.log("Feature to add collaborators coming soon...");
  };

  return (
    <Box>
      {projects.map((project) => (
        <ProjectEntry
          key={project._id}
          name={project.name}
          description={project.description}
          onDelete={() => handleDelete(project.id)}
          onGroupAction={() => handleGroupAction()}
        />
      ))}
    </Box>
  );
}
