import { useState, useEffect } from "react";
import {
  IconButton,
  Box,
  Typography,
  InputAdornment,
  FormControl,
  OutlinedInput,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { v4 as uuidv4 } from "uuid";

import { processQuery, getChatHistory } from "@/services/api";

function UserMessage({ message }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignSelf: "flex-end",
        margin: "10px 5px",
        padding: "0 20px",
        width: "fit-content",
        color: "#fff",
        backgroundColor: "#222",
        borderRadius: "20px",
      }}
    >
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={materialDark}
                language={match[1]}
                PreTag="div"
                children={String(children).replace(/\n$/, "")}
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {message.content}
      </ReactMarkdown>
    </Box>
  );
}

function AssistantMessage({ message }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        color: "#fff",
        margin: "10px 5px",
      }}
    >
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={materialDark}
                language={match[1]}
                PreTag="div"
                children={String(children).replace(/\n$/, "")}
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {message.content}
      </ReactMarkdown>
    </Box>
  );
}

export default function ChatBot({ user, projectId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [fetchError, setFetchError] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchChatHistory = async () => {
      const response = await getChatHistory(user.id, projectId);
      if (response.ok) {
        const data = await response.json();

        // Reset fetch error if it was previously set
        if (fetchError) {
          setFetchError(false);
        }

        setMessages(
          data.messages.map((message) => {
            return {
              id: uuidv4(),
              role: message.role,
              content: message.content,
            };
          })
        );
      } else {
        setFetchError(true);
      }
    };

    fetchChatHistory();
  }, []);

  const handleSend = async () => {
    if (input.trim()) {
      setInput("");
      setMessages((prevState) => [
        ...prevState,
        {
          id: uuidv4(),
          role: "user",
          content: input,
        },
      ]);

      // Disable input while processing
      setProcessing(true);

      const response = await processQuery(user.id, projectId, input);
      if (response.ok) {
        const data = await response.json();
        setMessages((prevState) => [
          ...prevState,
          {
            id: uuidv4(),
            role: "assistant",
            content: data.response,
          },
        ]);
      } else {
        setFetchError(true);
      }

      // Re-enable input after processing
      setProcessing(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        position: "relative",
        width: "400px",
        height: "100%",
        padding: "10px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          flexGrow: 1,
          flexBasis: "auto",
          overflowY: "auto",
        }}
      >
        {fetchError ? (
          <Typography variant="body2" color="error">
            Could not fetch chat history. Please try again later.
          </Typography>
        ) : (
          messages.map((message, index) =>
            message.role === "user" ? (
              <UserMessage key={index} message={message} />
            ) : (
              <AssistantMessage key={index} message={message} />
            )
          )
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          marginBottom: "auto",
        }}
      >
        <FormControl sx={{ margin: "0 5px", width: "100%" }}>
          <OutlinedInput
            placeholder="Ask me anything"
            multiline
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={handleSend} disabled={processing}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
      </Box>
    </Box>
  );
}
