"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Link,
} from "@mui/material";

import { useAuth } from "@/context/AuthProvider";
import { AppRegistration as Logo } from "@mui/icons-material";

export default function Login() {
  const router = useRouter();
  const { user, setUser, loading } = useAuth(); // Check if the user is already logged in using the AuthProvider

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  // Redirect to dashboard if auth check completed and user is logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading]);

  // Hide the page if auth check is not completed or user is already logged in
  if (loading || user) {
    return null;
  }

  const handleLogin = async () => {
    if (!username) {
      setUsernameError("Username is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    setUsernameError("");
    setPasswordError("");

    // Call backend api to login
    try {
      const response = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setLoginError("");
        setUser(data.username); // This triggers the redirect to dashboard
      } else {
        setLoginError("Invalid username or password");
      }
    } catch (error) {
      setLoginError(`Something went wrong: ${error}`);
    }
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Paper
        elevation={5}
        sx={{ padding: 4, width: "100%", maxWidth: "500px" }}
      >
        <Box sx={{ width: "100%", display: "flex", alignItems: "center" }}>
          <Logo sx={{ fontSize: 25 }} />
          <Typography variant="h6" sx={{ ml: 1 }}>
            CollabPen
          </Typography>
        </Box>
        <Typography variant="h4" sx={{ mt: 2 }}>
          Sign In
        </Typography>

        {loginError && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {loginError}
          </Typography>
        )}

        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setLoginError("");
          }}
          error={usernameError && !username}
          helperText={!username && usernameError}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setLoginError("");
          }}
          error={passwordError && !password}
          helperText={!password && passwordError}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
          sx={{ mt: 2 }}
        >
          Log In
        </Button>

        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          Don't have an account?{" "}
          <Link
            component="button"
            variant="body2"
            onClick={() => router.push("/register")}
            sx={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "secondary.main",
              fontWeight: 600,
              "&:hover": { color: "secondary.dark" },
            }}
          >
            Register
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}
