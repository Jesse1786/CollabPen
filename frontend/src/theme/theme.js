import { createTheme } from '@mui/material/styles';

// Color scheme inspired by: https://codepen.io/
const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#060606', // Default background color. Shiny black color
      paper: '#060606', // Default background for Navbar (and Paper component). Same as above
    },
    primary: {
      main: '#444857', // Background color for UI elements
      contrastText: '#ffffff', // White text
    },
    secondary: {
      main: '#03dac6', // Secondary background color for UI elements
      contrastText: '#000000', // Black text
    },
    label: {
      main: '#aaaebc'
    },
    divider: '#404040', // Subtle gray for dividers
  },
  typography: {
    fontFamily: `'Roboto', 'Helvetica', 'Arial', sans-serif`, // Same font for all text
    h4: {
      color: '#ffffff', // White heading
      fontWeight: 700,
    },
    body1: {
      color: '#b0b0b0', // Light gray
    },
    button: {
      fontWeight: 550,
      color: '#ffffff', // White text
    },
    label: {
      color: '#aaaebc', // 
      fontWeight: 600,
    }
  },
});

export default theme;