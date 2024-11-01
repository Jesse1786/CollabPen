import React, { useState, useEffect } from "react";
import { Box, Button, List, Typography } from "@mui/material";
import ProjectEntry from "../ProjectEntry/ProjectEntry";

// Temporary list until API call is implemented
const projectList = [
  {
    id: 1,
    name: "Project 1",
    description: "This is a description of project 1",
  },
  {
    id: 2,
    name: "Project 2",
    description: "This is a description of project 2",
  },
  {
    id: 3,
    name: "Project 3",
    description: "This is a description of project 3",
  },
];

export default function ProjectPanel() {
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    // const reponse = await fetch("http://localhost:8000/api/users/:username/:projects");
    // const data = await Response.json();
    // setProjects(data);
    setProjects(projectList);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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
          key={project.id}
          name={project.name}
          description={project.description}
          onDelete={() => handleDelete(project.id)}
          onGroupAction={() => handleGroupAction()}
        />
      ))}
    </Box>
  );
}
