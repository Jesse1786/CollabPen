import React, { useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';

// Docs: https://www.npmjs.com/package/@uiw/react-codemirror
function HtmlEditor( { value, setValue } ) {
  const onChange = useCallback((val, viewUpdate) => {
    console.log('val:', val);
    setValue(val);
  }, []);
  
  return <CodeMirror value={value} height="200px" width="600px" extensions={[html({ matchClosingTags: true })]} onChange={onChange} />;
}

export default HtmlEditor;