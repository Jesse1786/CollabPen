import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import ProjectEntry from "../ProjectEntry/ProjectEntry";
import AddProjectForm from "../AddProjectForm/AddProjectForm";
import AddCollaboratorForm from "../AddCollaboratorForm/AddCollaboratorForm";

import { useAuth } from "@/context/AuthProvider";

import { getUserProjects, deleteProject } from "@/services/api";

// Docs: https://mui.com/material-ui/react-dialog/
export default function ProjectPanel() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [projects, setProjects] = useState([]);

  // Used for the add project pop-up form
  const [projectFormOpen, setProjectFormOpen] = useState(false);

  // Used for the add collaborator pop-up form
  const [collaboratorFormOpen, setCollaboratorFormOpen] = useState(false);
  const [projectId, setProjectId] = useState("");

  // Get the user's projects from db and update the display
  const fetchProjects = async () => {
    const response = await getUserProjects(user.id);
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
    const response = await deleteProject(user.id, id);
    if (response.ok) {
      fetchProjects();
    }
  };

  const handleGroupAction = async (id) => {
    setProjectId(id);
    setCollaboratorFormOpen(true);
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
        <Typography variant="h4">My Projects</Typography>
        <Button
          variant="contained"
          color="addButton"
          onClick={() => setProjectFormOpen(true)}
        >
          <AddIcon sx={{ fontSize: 18, marginRight: "2px" }} />
          New project
        </Button>
      </Box>
      <Box sx={{ mt: 2 }}>
        {projects.map((project) => (
          <ProjectEntry
            key={project._id}
            type="personal"
            name={project.name}
            description={project.description}
            onDelete={() => handleDelete(project._id)}
            onGroupAction={() => handleGroupAction(project._id)}
            onClick={() => router.push(`/project-workspace/${project._id}`)}
          />
        ))}
      </Box>
      <AddProjectForm
        user={user}
        open={projectFormOpen}
        setOpen={setProjectFormOpen}
        fetchProjects={fetchProjects}
      />
      <AddCollaboratorForm
        user={user}
        projectId={projectId}
        open={collaboratorFormOpen}
        setOpen={setCollaboratorFormOpen}
      />
    </>
  );
}
