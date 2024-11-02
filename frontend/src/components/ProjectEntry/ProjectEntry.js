import React from "react";
import { Box, IconButton, Card, CardContent, Typography } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ProjectEntry({
  id,
  name,
  description,
  onDelete,
  onGroupAction,
  onClick,
}) {
  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 3,
        mb: 3,
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          onClick={onClick}
          sx={{
            cursor: "pointer",
            "&:hover": {
              color: "secondary.main",
            },
          }}
        >
          {name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <Box>
        <IconButton onClick={() => onGroupAction()}>
          <GroupIcon />
        </IconButton>
        <IconButton onClick={() => onDelete()}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </Card>
  );
}
