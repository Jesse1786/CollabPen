import { useEffect, useRef } from "react";
import { Box, Typography } from "@mui/material";
import { html } from "@codemirror/lang-html";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { yCollab } from "y-codemirror.next";

/* 
  Docs:
  https://www.npmjs.com/package/@uiw/react-codemirror
  https://www.npmjs.com/package/@codemirror/lang-html

  TODO: (low priority) find out how to apply theme to the scrollbar
*/
export default function EditorHTML({ yHtml, awareness }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const editorState = EditorState.create({
      doc: yHtml.toString(),
      extensions: [basicSetup, html(), yCollab(yHtml, awareness), vscodeDark],
    });

    const editorView = new EditorView({
      state: editorState,
      parent: editorRef.current,
    });

    return () => {
      editorView.destroy();
    };
  }, []);

  return (
    <Box
      sx={{
        borderLeft: "1px solid",
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#1e1e1e",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "7px 15px",
          borderTop: "3px solid",
          borderColor: "#E34F26",
        }}
      >
        <Typography variant="label">HTML</Typography>
      </Box>

      <Box
        ref={editorRef}
        sx={{
          height: "35vh",
          "& .cm-editor": {
            height: "100%",
          },
        }}
      />
    </Box>
  );
}
