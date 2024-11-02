"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Grid2 as Grid, Box } from "@mui/material";
import io from "socket.io-client";

import { useAuth } from "@/context/AuthProvider";
import { htmlPlaceholder, cssPlaceholder, jsPlaceholder } from "../placeholder";
import EditorHTML from "@/components/EditorHTML/EditorHTML";
import EditorCSS from "@/components/EditorCSS/EditorCSS";
import EditorJS from "@/components/EditorJS/EditorJS";
import Preview from "@/components/Preview/Preview";
import Navbar from "@/components/Navbar/Navbar";

// Placeholder url
const URL = "http://localhost:4000";

export default function ProjectWorkspace() {
  const router = useRouter();
  const { projectId } = useParams();

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

  // Fetch project data from the server
  useEffect(() => {
    const fetchProjectData = async () => {
      if (projectId && user) {
        try {
          const response = await fetch(
            `http://localhost:4000/api/users/${user}/projects/${projectId}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
            }
          );

          if (!response.ok) {
            console.log(response.statusText);
          }

          const data = await response.json();
          setHtml(data.html);
          setCss(data.css);
          setJs(data.js);
        } catch (error) {
          console.error("Error fetching project data:", error);
        }
      }
    };

    fetchProjectData();
  }, [projectId, user]);

  // Save project to the server periodically. This prevents overloading the server with requests on each input change
  useEffect(() => {
    const interval = setInterval(() => {
      saveProject();
    }, 3000);

    return () => {
      clearInterval(interval); // Makes it so only one interval is running at a time
    }
  }, [html, css, js]);

  const saveProject = async () => {
    await fetch(`http://localhost:4000/api/users/${user}/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ html, css, js }),
    });
  };



  // Hide the page if auth check is not completed or user is not logged in
  if (loading || !user) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          height: "calc(100vh - 7px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
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
      </Box>
    </>
  );
}
