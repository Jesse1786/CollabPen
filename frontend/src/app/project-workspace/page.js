"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Grid2 as Grid, Box } from "@mui/material";
import io from "socket.io-client";

import { useAuth } from "@/context/AuthProvider";
import { htmlPlaceholder, cssPlaceholder, jsPlaceholder } from "./placeholder";
import EditorHTML from "@/components/EditorHTML/EditorHTML";
import EditorCSS from "@/components/EditorCSS/EditorCSS";
import EditorJS from "@/components/EditorJS/EditorJS";
import Preview from "@/components/Preview/Preview";
import Navbar from "@/components/Navbar/Navbar";

// Placeholder url
const URL = "http://localhost:4000";

export default function ProjectWorkspace() {
  const router = useRouter();

  const { user, loading } = useAuth(); // Check if the user is already logged in using the AuthProvider
  const [html, setHtml] = useState(htmlPlaceholder);
  const [css, setCss] = useState(cssPlaceholder);
  const [js, setJs] = useState(jsPlaceholder);
  const [socket, setSocket] = useState(null);

  // Redirect to login if auth check completed and user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    const sock = io(URL);
    setSocket(sock);

    return () => {
      sock.disconnect();
    };
  }, []);

  // Hide the page if auth check is not completed or user is not logged in
  if (loading || !user) {
    return null;
  }

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "99vh",
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

        <Box
          sx={{
            flexGrow: 1,
            marginTop: "15px",
            padding: "0 20px",
            minHeight: "400px",
          }}
        >
          <Preview html={html} css={css} js={js} />
        </Box>
      </Box>
    </>
  );
}
