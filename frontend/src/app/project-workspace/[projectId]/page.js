"use client";

import React, { useEffect, useState, useRef } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useParams, useRouter } from "next/navigation";
import { Grid2 as Grid, Box } from "@mui/material";

import { getRandomColour } from "@/utils/colors";
import { useAuth } from "@/context/AuthProvider";
import EditorHTML from "@/components/EditorHTML/EditorHTML";
import EditorCSS from "@/components/EditorCSS/EditorCSS";
import EditorJS from "@/components/EditorJS/EditorJS";
import Preview from "@/components/Preview/Preview";
import Navbar from "@/components/Navbar/Navbar";

/* 
Docs: 
https://github.com/yjs/y-codemirror.next
https://www.npmjs.com/package/y-websocket

NOTE: Need to run the following command in /frontend/ to set up the y-websocket server:
HOST=localhost PORT=1234 npx y-websocket

I will refactor to attach the y-websocket server to the backend server later, but for now use the command above
*/
export default function ProjectWorkspace() {
  const router = useRouter();
  const { projectId } = useParams();
  const { user, loading } = useAuth(); // Check if the user is already logged in using the AuthProvider

  const [isSynced, setIsSynced] = useState(false); // Make sure the Yjs refs are ready before rendering
  const [hasAccessPerm, setHasAccessPerm] = useState(false); // Make sure user is allowed to view the project
  const [doc, setDoc] = useState({ html: "", css: "", js: "" }); // To update the local Preview component

  // Refs are needed to pass the Yjs sub-documents and provider awareness to the editors
  const providerRef = useRef(null);
  const yHtmlRef = useRef(null);
  const yCssRef = useRef(null);
  const yJsRef = useRef(null);

  const YWS_URL =
    process.env.NEXT_PUBLIC_ENV === "prod"
      ? process.env.NEXT_PUBLIC_YWS_URL || "ws://localhost:1234"
      : "ws://localhost:1234";

  // Redirect to login if auth check completed and user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  useEffect(() => {
    if (!loading && user && projectId) {
      // TODO: (high priority) Check to see if the user is the owner or a collaborator of the project. If they are not, redirect them to the dashboard
      // I probably need to set up a new state called authorized or something to prevent content from rendering in the meantime

      // TODO: Fix bug with the connection error message. Everything works but I need to figure out what it is

      // Give the user's cursor a random color
      const userColor = getRandomColour();

      // Connect to the y-websocket server to sync the Yjs documents
      const ydoc = new Y.Doc();
      const provider = new WebsocketProvider(YWS_URL, projectId, ydoc);

      // Create sub-documents for HTML, CSS, and JS
      const yHtml = ydoc.getText("html");
      const yCss = ydoc.getText("css");
      const yJs = ydoc.getText("js");

      // Need ref to access the sub-documents when outside the useEffect
      yHtmlRef.current = yHtml;
      yCssRef.current = yCss;
      yJsRef.current = yJs;

      // Set the user's name and cursor color
      provider.awareness.setLocalStateField("user", {
        name: user,
        color: userColor.color,
        colorLight: userColor.light,
      });

      // Need ref to provider awareness to pass it to editors
      providerRef.current = provider.awareness;

      const updatePreview = () => {
        setDoc({
          html: yHtml.toString(),
          css: yCss.toString(),
          js: yJs.toString(),
        });
      };

      // When the Yjs documents change, update the local Preview component
      yHtml.observe(updatePreview);
      yCss.observe(updatePreview);
      yJs.observe(updatePreview);

      setIsSynced(true);

      return () => {
        provider.disconnect();
        ydoc.destroy();
      };
    }
  }, [user, loading, projectId]);

  // Hide the page if auth check is not completed or user is not logged in
  // TODO: Add authorized state as well, later though
  if (loading || !user || !isSynced || !projectId) {
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
              {isSynced && (
                <EditorHTML
                  yHtml={yHtmlRef.current}
                  awareness={providerRef.current}
                />
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              {isSynced && (
                <EditorCSS
                  yCss={yCssRef.current}
                  awareness={providerRef.current}
                />
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              {isSynced && (
                <EditorJS
                  yJs={yJsRef.current}
                  awareness={providerRef.current}
                />
              )}
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
            {isSynced && <Preview html={doc.html} css={doc.css} js={doc.js} />}
          </Box>
        </Box>
      </Box>
    </>
  );
}
