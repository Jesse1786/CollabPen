import { useEffect, useCallback } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { Box, Typography } from "@mui/material";
import { javascript } from "@codemirror/lang-javascript";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

import { createDelta, resolveDelta } from "@/lib/delta";

/* 
  Docs:
  https://www.npmjs.com/package/@uiw/react-codemirror
  https://www.npmjs.com/package/@codemirror/lang-javascript
*/
export default function EditorJS({ value, setValue }) {
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
          borderColor: "#F7DF1E",
        }}
      >
        <Typography variant="label">JavaScript</Typography>
      </Box>

      <CodeMirror
        value={value}
        extensions={[javascript({ jsx: true })]}
        theme={vscodeDark}
        onChange={setValue}
        height="35vh"
      />
    </Box>
  );
}
