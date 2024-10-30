import React from "react";
import { AppBar, Toolbar, Button, Typography, Box } from "@mui/material";
import { AppRegistration as Logo } from "@mui/icons-material";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";

// Docs: https://mui.com/material-ui/react-app-bar/
export default function Navbar() {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Logo sx={{ fontSize: 40 }} />
        <Typography variant="h4" sx={{ marginLeft: "10px", flexGrow: 1 }}>
          CollabPen
        </Typography>
        <Box>
          <Button variant="contained">
            <DashboardIcon sx={{ fontSize: 18, marginRight: "2px" }} />
            <Typography variant="button">Dashboard</Typography>
          </Button>
          <Button variant="contained" sx={{ marginLeft: "10px" }}>
            <SettingsIcon sx={{ fontSize: 18, marginRight: "2px" }} />
            <Typography variant="button">Settings</Typography>
          </Button>
          <Button variant="contained" sx={{ marginLeft: "10px" }}>
            <LogoutIcon sx={{ fontSize: 18, marginRight: "2px" }} />
            <Typography variant="button">Log Out</Typography>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
