"use client";

import React, { useEffect, useState, useRef } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useParams, useRouter } from "next/navigation";
import { Grid2 as Grid, Box } from "@mui/material";
import { encode as base64Encode } from "base64-arraybuffer";

import { getRandomColour } from "@/utils/colors";
import { useAuth } from "@/context/AuthProvider";
import EditorHTML from "@/components/EditorHTML/EditorHTML";
import EditorCSS from "@/components/EditorCSS/EditorCSS";
import EditorJS from "@/components/EditorJS/EditorJS";
import Preview from "@/components/Preview/Preview";
import Navbar from "@/components/Navbar/Navbar";
import ChatBot from "@/components/ChatBot/ChatBot";
import WorkspaceToolbar from "@/components/WorkspaceToolbar/WorkspaceToolbar";

import { getProject, updateProject } from "@/services/api";

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
      // Declare variables in the outer scope so they can be accessed in the cleanup function
      let ydoc;
      let provider;
      let saveInterval;
      let yHtml;
      let yCss;
      let yJs;

      // Helper to update the local Preview component
      const updatePreview = () => {
        setDoc({
          html: yHtml.toString(),
          css: yCss.toString(),
          js: yJs.toString(),
        });
      };

      // Fetch the project data and set up Y.Doc and provider
      const setupYDoc = async () => {
        // Fetch the project data from the backend
        const response = await getProject(user.id, projectId);
        const data = await response.json();

        // Create our local ydoc
        ydoc = new Y.Doc();

        // Decode the base64-encoded string to a Uint8Array
        const ydocUpdate = Uint8Array.from(atob(data.ydoc), (c) =>
          c.charCodeAt(0)
        );

        // Apply the update to the Y.Doc
        Y.applyUpdate(ydoc, ydocUpdate);

        // Connect to the provider
        provider = new WebsocketProvider(YWS_URL, projectId, ydoc);

        // Create sub-documents for HTML, CSS, and JS
        yHtml = ydoc.getText("html");
        yCss = ydoc.getText("css");
        yJs = ydoc.getText("js");

        // Store refs
        yHtmlRef.current = yHtml;
        yCssRef.current = yCss;
        yJsRef.current = yJs;

        // Update preview with initial data
        updatePreview();

        // Give the user's cursor a random color
        const userColor = getRandomColour();

        // Set the user's name and cursor color
        provider.awareness.setLocalStateField("user", {
          name: user.name || user.email,
          color: userColor.color,
          colorLight: userColor.light,
        });

        // Store provider awareness ref
        providerRef.current = provider.awareness;

        // Observe changes to update the preview
        yHtml.observe(updatePreview);
        yCss.observe(updatePreview);
        yJs.observe(updatePreview);

        setIsSynced(true);

        // Periodically save the Yjs document to the database
        saveInterval = setInterval(async () => {
          // Encode the Y.Doc state as an update
          const ydocUpdate = Y.encodeStateAsUpdate(ydoc);

          // Convert the Uint8Array to a base64-encoded string
          const ydocBase64 = base64Encode(ydocUpdate);

          await updateProject(user.id, projectId, ydocBase64);
        }, 3000); // Save every 3 seconds
      };

      setupYDoc();

      // Cleanup function
      return () => {
        if (saveInterval) {
          clearInterval(saveInterval);
        }
        if (provider) provider.disconnect();
        if (ydoc) ydoc.destroy();
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
              display: "flex",
              flexDirection: "row",
              flexGrow: 1,
            }}
          >
            <WorkspaceToolbar user={user} projectId={projectId} />
            <Box
              sx={{
                flexGrow: 1,
                marginTop: "15px",
                padding: "0 20px",
                minHeight: "400px",
              }}
            >
              {isSynced && (
                <Preview html={doc.html} css={doc.css} js={doc.js} />
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
