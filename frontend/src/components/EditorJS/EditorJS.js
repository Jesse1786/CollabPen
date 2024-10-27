import React, { useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

/* 
  Docs:
  https://www.npmjs.com/package/@uiw/react-codemirror
  https://www.npmjs.com/package/@codemirror/lang-javascript
*/
function EditorJS( { value, setValue } ) {
  const onChange = useCallback((val) => {
    console.log('val:', val);
    setValue(val);
  }, [setValue]);
  
  return (
    <CodeMirror
      value={value}
      extensions={[javascript({ jsx: true })]}
      theme={vscodeDark}
      onChange={onChange}
      height="35vh"
    />
  );
}

export default EditorJS;