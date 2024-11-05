"use client";

import React, { useEffect, useState, useRef } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useParams, useRouter } from "next/navigation";
import { Grid2 as Grid, Box } from "@mui/material";

import { useAuth } from "@/context/AuthProvider";
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

  const [doc, setDoc] = useState({ html: "", css: "", js: "" });
  const yHtmlRef = useRef(null);
  const yCssRef = useRef(null);
  const yJsRef = useRef(null);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      "ws://localhost:1234",
      "project-workspace-test",
      ydoc
    );
    const yHtml = ydoc.getText("html");
    const yCss = ydoc.getText("css");
    const yJs = ydoc.getText("js");

    yHtmlRef.current = yHtml;
    yCssRef.current = yCss;
    yJsRef.current = yJs;

    yHtml.observe(() => {
      setDoc((prevDoc) => ({ ...prevDoc, html: yHtml.toString() }));
    });

    yCss.observe(() => {
      setDoc((prevDoc) => ({ ...prevDoc, css: yCss.toString() }));
    });

    yJs.observe(() => {
      setDoc((prevDoc) => ({ ...prevDoc, js: yJs.toString() }));
    });

    return () => {
      provider.disconnect();
      ydoc.destroy();
    };
  }, []);

  const handleHtmlChange = (value) => {
    setDoc((prevDoc) => ({ ...prevDoc, html: value }));

    yHtmlRef.current.delete(0, yHtmlRef.current.length);
    yHtmlRef.current.insert(0, value);
  };

  const handleCssChange = (value) => {
    setDoc((prevDoc) => ({ ...prevDoc, css: value }));

    yCssRef.current.delete(0, yCssRef.current.length);
    yCssRef.current.insert(0, value);
  };

  const handleJsChange = (value) => {
    setDoc((prevDoc) => ({ ...prevDoc, js: value }));

    yJsRef.current.delete(0, yJsRef.current.length);
    yJsRef.current.insert(0, value);
  };

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
              <EditorHTML value={doc.html} setValue={handleHtmlChange} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <EditorCSS value={doc.css} setValue={handleCssChange} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <EditorJS value={doc.js} setValue={handleJsChange} />
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
            <Preview html={doc.html} css={doc.css} js={doc.js} />
          </Box>
        </Box>
      </Box>
    </>
  );
}
