import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";

import ProjectEntry from "../ProjectEntry/ProjectEntry";

import { useAuth } from "@/context/AuthProvider";

import { getSharedProjects } from "@/services/api";

// Docs: https://mui.com/material-ui/react-dialog/
export default function SharedProjectPanel() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState([]);

  // Get the shared projects from db and update the display
  const fetchProjects = async () => {
    const response = await getSharedProjects(user.id);
    const data = await response.json();
    setProjects(data);
  };

  // Fetch projects once the user is loaded
  useEffect(() => {
    if (!loading && user) {
      fetchProjects();
    }
  }, [loading, user]);

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
        <Typography variant="h4">Projects Shared With You</Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        {projects.map((project) => (
          <ProjectEntry
            key={project._id}
            type="shared"
            name={project.name}
            description={project.description}
            onClick={() => router.push(`/project-workspace/${project._id}`)}
          />
        ))}
      </Box>
    </>
  );
}
