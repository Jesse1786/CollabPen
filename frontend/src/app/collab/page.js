"use client";

import React, { useEffect, useRef } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { EditorState } from "@codemirror/state";
import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { yCollab } from "y-codemirror.next";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import * as random from "lib0/random";

export const userColors = [
  { color: "#30bced", light: "#30bced33" },
  { color: "#6eeb83", light: "#6eeb8333" },
  { color: "#ffbc42", light: "#ffbc4233" },
  { color: "#ecd444", light: "#ecd44433" },
  { color: "#ee6352", light: "#ee635233" },
  { color: "#9ac2c9", light: "#9ac2c933" },
  { color: "#8acb88", light: "#8acb8833" },
  { color: "#1be7ff", light: "#1be7ff33" },
];

// Much of this code is from the y-codemirror.next library's documentation
// Docs: https://github.com/yjs/y-codemirror.next
export default function TestArea() {
  const editorRef = useRef(null);
  const yTextRef = useRef(null);

  useEffect(() => {
    // Assign a random color to the user for their cursor
    const userColor = userColors[random.uint32() % userColors.length];

    const ydoc = new Y.Doc();
    const provider = new WebsocketProvider(
      "ws://localhost:1234",
      "test-room-123",
      ydoc
    );
    const yText = ydoc.getText("shared-text");

    yTextRef.current = yText;

    provider.awareness.setLocalStateField("user", {
      name: "Anonymous " + Math.floor(Math.random() * 100),
      color: userColor.color,
      colorLight: userColor.light,
    });

    const editorState = EditorState.create({
      doc: yText.toString(),
      extensions: [
        basicSetup,
        javascript(),
        yCollab(yText, provider.awareness),
        vscodeDark,
      ],
    });

    const editorView = new EditorView({
      state: editorState,
      parent: editorRef.current,
    });

    return () => {
      provider.disconnect();
      ydoc.destroy();
      editorView.destroy();
    };
  }, []);

  return (
    <div>
      <h1>Test Area</h1>
      <div ref={editorRef} style={{ height: "35vh" }}></div>
    </div>
  );
}
