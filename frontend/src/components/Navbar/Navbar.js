import React from 'react';
import { AppBar, Toolbar, Button, Typography, Box } from '@mui/material';
import { AppRegistration as Logo } from '@mui/icons-material';
import styles from './Navbar.module.css';


// Docs: https://mui.com/material-ui/react-app-bar/
function Navbar() {
  return (
    <AppBar position="static" elevation={0} className={styles.navbar} sx={{bgcolor: 'background.default'}}>
      <Toolbar>
        <Logo sx={{ fontSize: 40 }} />
        <Typography variant="h4" sx={{ marginLeft: '10px', flexGrow: 1 }}>
          CollabPen
        </Typography>
        <Box>
          <Button color="inherit">Dashboard</Button>
          <Button color="inherit">Settings</Button>
          <Button color="inherit">Sign Out</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;