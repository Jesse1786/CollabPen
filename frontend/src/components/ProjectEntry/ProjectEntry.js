import React from "react";
import { Box, IconButton, ListItem, ListItemText, Card, CardContent, Typography } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ProjectEntry({ id, name, description, onDelete }) {
  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
        mb: 2,
      }}
    >
      <CardContent>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2" color="text.secondary">{description}</Typography>
      </CardContent>
      <Box>
        <IconButton onClick={() => console.log(`Group action for ${id}`)}>
          <GroupIcon />
        </IconButton>
        <IconButton onClick={() => onDelete(id)}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
}