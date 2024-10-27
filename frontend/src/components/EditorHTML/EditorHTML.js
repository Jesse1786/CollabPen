import React, { useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

/* 
  Docs:
  https://www.npmjs.com/package/@uiw/react-codemirror
  https://www.npmjs.com/package/@codemirror/lang-html

  TODO: refactor all code editors into one
  TODO: find out how to apply theme to the scrollbar
*/
function EditorHTML({ value, setValue }) {
  const onChange = useCallback((val) => {
    console.log('val:', val);
    setValue(val);
  }, [setValue]);

  return (
    <CodeMirror
      value={value}
      extensions={[html({ matchClosingTags: true })]}
      theme={vscodeDark}
      onChange={onChange}
      height="35vh"
    />
  );
}

export default EditorHTML;