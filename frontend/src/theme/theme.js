import { createTheme } from '@mui/material/styles';

// Color scheme inspired by: https://codepen.io/
const theme = createTheme({
  palette: {
    mode: 'dark', // Dark mode, because light mode hurts my eyes
    background: {
      default: '#060606', // Shiny black
      paper: '#2b2b2b', // Light grey
    },
    primary: {
      main: '#21ce99', // Bright green for primary buttons and some text
      contrastText: '#ffffff', // White text on primary color
    },
    secondary: {
      main: '#ffffff', // White for secondary buttons and text accents
      contrastText: '#1e1e1e', // Dark text on light secondary background
    },
    navbarText: {
      main: '#ffffff', // White color for the navbar text/buttons
    },
    text: {
      primary: '#ffffff', // White for primary text on a dark background
      secondary: '#b0b0b0', // Lighter gray for secondary text
    },
    divider: '#404040', // Subtle gray for dividers
    success: {
      main: '#21ce99', // Green color for success messages or highlights
    },
    error: {
      main: '#ff4563', // Bright red for error messages
    },
  },
  typography: {
    fontFamily: `'Roboto', 'Helvetica', 'Arial', sans-serif`, // Same font for all text
    h4: {
      color: '#ffffff', // White color for headers
      fontWeight: 700,
    },
    body1: {
      color: '#b0b0b0', // Light gray for body text readability
    },
    button: {
      fontWeight: 600,
      color: '#ffffff', // White text on buttons
    },
  },
});

export default theme;