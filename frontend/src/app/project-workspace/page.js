import { useState, useEffect } from "react";
import { Grid2 as Grid, Box } from "@mui/material";
import io from "socket.io-client";

import { htmlPlaceholder, cssPlaceholder, jsPlaceholder } from "./placeholder";
import EditorHTML from "@/components/EditorHTML/EditorHTML";
import EditorCSS from "@/components/EditorCSS/EditorCSS";
import EditorJS from "@/components/EditorJS/EditorJS";
import Preview from "@/components/Preview/Preview";

// Placeholder url
const URL = "http://localhost:4000";

export default function ProjectWorkspace() {
  const [html, setHtml] = useState(htmlPlaceholder);
  const [css, setCss] = useState(cssPlaceholder);
  const [js, setJs] = useState(jsPlaceholder);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const sock = io(URL);
    setSocket(sock);

    return () => {
      sock.disconnect();
    };
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          borderTop: "1px solid",
          borderBottom: "1px solid",
          borderColor: "divider",
          padding: "0 20px",
        }}
      >
        <Grid size={{ xs: 12, md: 4 }}>
          <EditorHTML value={html} setValue={setHtml} socket={socket} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <EditorCSS value={css} setValue={setCss} socket={socket} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <EditorJS value={js} setValue={setJs} socket={socket} />
        </Grid>
      </Grid>

      <Box sx={{ flexGrow: 1, marginTop: "15px", padding: "0 20px" }}>
        <Preview html={html} css={css} js={js} />
      </Box>
    </Box>
  );
}
