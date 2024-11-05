import React from "react";
import { Box } from "@mui/material";

// TODO: (med priority) Implement security features
// TODO: (low priority) Polish frontend design. Add sliders to resize editors, collapser to hide editors, label above the editors, etc
export default function Preview({ html, css, js }) {
  const srcDoc = `
    <html>
      <head>
        <!-- Normalize CSS, so browsers render our page consistently -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" />
        <style>
          ${css.toString()}
        </style>
      </head>
      <body>
        ${html.toString()}
        <script>
          ${js.toString()}
        </script>
      </body>
    </html>
  `;

  return (
    <Box
      component="iframe"
      srcDoc={srcDoc}
      width="100%"
      height="100%"
      sx={{ border: "1px solid", borderColor: "divider" }}
    />
  );
}
