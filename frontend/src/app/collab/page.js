"use client";

import React, { useEffect, useState, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from "@uiw/codemirror-theme-vscode";

// Testing page for yjs and y-websocket, I will delete this later!
export default function TestArea() {
  const [text, setText] = useState("");
  const yTextRef = useRef(null);

  useEffect(() => {
    const ydoc = new Y.Doc();
    // Need to do the following command in frontend page to start websocket server. Will refactor to attach y-websocket to express server later
    // HOST=localhost PORT=1234 npx y-websocket
    const provider = new WebsocketProvider('ws://localhost:1234', 'my-roomname', ydoc);
    const yText = ydoc.getText('shared-text');

    yTextRef.current = yText; 

    yText.observe(() => {
      setText(yText.toString());
    });

    return () => {
      provider.disconnect();
      ydoc.destroy();
    };
  }, []);

  const handleEditorChange = (value) => {
    setText(value);

    yTextRef.current.delete(0, yTextRef.current.length);
    yTextRef.current.insert(0, value);
  };

  return (
    <div>
      <h1>test areaa</h1>
      <CodeMirror
        value={text}
        height="35vh"
        extensions={[javascript()]}
        theme={vscodeDark}
        onChange={(value) => handleEditorChange(value)}
      />
    </div>
  );
}
