import { useEffect, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { Box, Typography } from "@mui/material";
import { html } from "@codemirror/lang-html";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

import { createDelta, resolveDelta } from "@/lib/delta";

/* 
  Docs:
  https://www.npmjs.com/package/@uiw/react-codemirror
  https://www.npmjs.com/package/@codemirror/lang-html

  TODO: refactor all code editors into one
  TODO: find out how to apply theme to the scrollbar
*/
export default function EditorHTML({ value, setValue, socket }) {
  useEffect(() => {
    if (!socket) return;

    socket.on("receive-delta-html", (delta) => {
      // Use previous value to resolve race conditions
      setValue((prev) => resolveDelta(prev, delta));
    });

    return () => {
      socket.off("receive-delta-html");
    };
  }, [socket, value]);

  const onChange = useCallback(
    (val, viewUpdate) => {
      if (!socket || !viewUpdate) return;

      const delta = createDelta(val, viewUpdate.changedRanges);
      if (delta) socket.emit("send-delta-html", delta);
      setValue(val);
    },
    [setValue, socket]
  );

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

      <CodeMirror
        value={value}
        extensions={[html({ matchClosingTags: true })]}
        theme={vscodeDark}
        onChange={onChange}
        height="35vh"
      />
    </Box>
  );
}
