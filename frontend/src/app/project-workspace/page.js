import { useState, useEffect } from "react";
import { Grid2 as Grid, Box } from "@mui/material";
import io from "socket.io-client";

import { htmlPlaceholder, cssPlaceholder, jsPlaceholder } from "./placeholder";
import EditorHTML from "@/components/EditorHTML/EditorHTML";
import EditorCSS from "@/components/EditorCSS/EditorCSS";
import EditorJS from "@/components/EditorJS/EditorJS";
import Preview from "@/components/Preview/Preview";

import { resolveDelta } from "@/lib/delta";

// Placeholder url
const URL = "http://localhost:4000";

export default function ProjectWorkspace() {
  const [html, setHtml] = useState(htmlPlaceholder);
  const [css, setCss] = useState(cssPlaceholder);
  const [js, setJs] = useState(jsPlaceholder);
  const [htmlDelta, setHtmlDelta] = useState(null);
  const [cssDelta, setCssDelta] = useState(null);
  const [jsDelta, setJsDelta] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const sock = io(URL);
    setSocket(sock);

    return () => {
      sock.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("receive-delta-html", (delta) => {
      setHtml(resolveDelta(html, delta));
    });

    return () => {
      socket.off("receive-delta-html");
    };
  }, [socket, html]);

  useEffect(() => {
    if (!socket) return;
    socket.on("receive-delta-css", (delta) => {
      setCss(resolveDelta(css, delta));
    });

    return () => {
      socket.off("receive-delta-css");
    };
  }, [socket, css]);

  useEffect(() => {
    if (!socket) return;
    socket.on("receive-delta-js", (delta) => {
      setJs(resolveDelta(js, delta));
    });

    return () => {
      socket.off("receive-delta-js");
    };
  }, [socket, js]);

  useEffect(() => {
    if (!socket || !htmlDelta) return;

    socket.emit("send-delta-html", htmlDelta);
  }, [socket, htmlDelta]);

  useEffect(() => {
    if (!socket || !cssDelta) return;

    socket.emit("send-delta-css", cssDelta);
  }, [socket, cssDelta]);

  useEffect(() => {
    if (!socket || !jsDelta) return;

    socket.emit("send-delta-js", jsDelta);
  }, [socket, jsDelta]);

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
          <EditorHTML value={html} setValue={setHtml} setDelta={setHtmlDelta} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <EditorCSS value={css} setValue={setCss} setDelta={setCssDelta} />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <EditorJS value={js} setValue={setJs} setDelta={setJsDelta} />
        </Grid>
      </Grid>

      <Box sx={{ flexGrow: 1, marginTop: "15px", padding: "0 20px" }}>
        <Preview html={html} css={css} js={js} />
      </Box>
    </Box>
  );
}
