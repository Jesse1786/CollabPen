import React, { useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { Box, Typography } from '@mui/material';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

/* 
  Docs:
  https://www.npmjs.com/package/@uiw/react-codemirror
  https://www.npmjs.com/package/@codemirror/lang-javascript
*/
function EditorJS({ value, setValue }) {
  const onChange = useCallback((val) => {
    console.log('val:', val);
    setValue(val);
  }, [setValue]);

  return (
    <Box sx={{borderLeft: '1px solid', borderRight: '1px solid', borderColor: 'divider'}}>
      <Box sx={{
        backgroundColor: '#1e1e1e',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '7px 15px',
        borderTop: '3px solid',
        borderColor: '#F7DF1E',
      }}>
        <Typography variant='label'>
          JavaScript
        </Typography>
      </Box>

      <CodeMirror
        value={value}
        extensions={[javascript({ jsx: true })]}
        theme={vscodeDark}
        onChange={onChange}
        height="35vh"
      />
    </Box>
  );
}

export default EditorJS;