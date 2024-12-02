import { useState } from "react";
import { Box, Tooltip, IconButton } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";

import ChatBot from "../ChatBot/ChatBot";

export default function WorkspaceToolbar({ user, projectId }) {
  const [selectedItem, setSelectedItem] = useState(-1);

  const selectItemHandler = (index) => {
    if (index === selectedItem) {
      setSelectedItem(-1);
    } else {
      setSelectedItem(index);
    }
  };

  const menuItems = [
    {
      index: 0,
      icon: <ChatIcon />,
      label: "Chat",
      component: <ChatBot user={user} projectId={projectId} />,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid",
          borderColor: "divider",
          gap: "10px",
          padding: "10px",
        }}
      >
        {menuItems.map((item, index) => (
          <Tooltip key={index} title={item.label}>
            <IconButton
              onClick={() => selectItemHandler(item.index)}
              sx={{
                color: selectedItem === item.index ? "#fff" : "#ccc",
                backgroundColor:
                  selectedItem === item.index ? "primary.main" : "transparent",
                "&:hover": {
                  color: "#fff",
                  backgroundColor:
                    selectedItem === item.index
                      ? "primary.main"
                      : "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              {item.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Box>
      {menuItems.find((item) => item.index === selectedItem) ? (
        <Box
          sx={{
            flex: 1,
            padding: "20px",
            overflow: "auto",
            borderRight: "1px solid",
            borderColor: "divider",
          }}
        >
          {menuItems.find((item) => item.index === selectedItem)?.component ||
            null}
        </Box>
      ) : null}
    </Box>
  );
}
