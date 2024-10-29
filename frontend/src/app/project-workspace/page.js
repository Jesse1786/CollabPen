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

  useEffect(() => {
    if (!socket || !html) return;
    socket.on("receive-delta-html", (delta) => {
      setHtml(delta);
    });

    socket.on("receive-delta-css", (delta) => {
      setCss(delta);
    });

    socket.on("receive-delta-js", (delta) => {
      setJs(delta);
    });

    return () => {
      socket.off("receive-delta-html");
      socket.off("receive-delta-css");
      socket.off("receive-delta-js");
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("send-delta-html", html);
  }, [html, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("send-delta-css", css);
  }, [css, socket]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("send-delta-js", js);
  }, [js, socket]);

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
          <EditorHTML value={html} setValue={setHtml} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <EditorCSS value={css} setValue={setCss} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <EditorJS value={js} setValue={setJs} />
        </Grid>
      </Grid>

      <Box sx={{ flexGrow: 1, marginTop: "15px", padding: "0 20px" }}>
        <Preview html={html} css={css} js={js} />
      </Box>
    </Box>
  );
}
