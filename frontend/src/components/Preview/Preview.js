import React from 'react';
import { Box } from '@mui/material';

// TODO: (medium priority) Implement security features
// TODO: (low priority) Polish frontend design. Add sliders to resize editors, collapser to hide editors, label above the editors, etc
function Preview({ html, css, js }) {
  const srcDoc = `
    <html>
      <style>${css}</style>
      <body>${html}</body>
      <script>${js}</script>
    </html>
  `;

  return (
      <Box
        component="iframe"
        srcDoc={srcDoc}
        width="100%"
        height="100%"
        sx={{ border: 'none' }}
      />
  );
}

export default Preview;