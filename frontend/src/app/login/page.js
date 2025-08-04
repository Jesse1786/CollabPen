"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Link,
} from "@mui/material";
import { AppRegistration as Logo } from "@mui/icons-material";

import { useAuth } from "@/context/AuthProvider";

import { login, googleLogin } from "@/services/api";

import googleLogo from "@/public/google-logo.webp";

export default function Login() {
  const router = useRouter();
  const { user, setUser, loading } = useAuth(); // Check if the user is already logged in using the AuthProvider

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
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
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    setEmailError("");
    setPasswordError("");

    // Call backend api to login
    try {
      const response = await login(email, password);

      if (response.status === 200) {
        const data = await response.json();
        setUser({ id: data.id, email: data.email }); // This triggers the redirect to dashboard
      } else {
        setLoginError("Invalid email or password");
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
        bgcolor: "background.default", // explicitly set background
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
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setLoginError("");
          }}
          error={emailError && !email}
          helperText={!email && emailError}
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

        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={googleLogin}
          sx={{ mt: 2 }}
        >
          <Image
            src={googleLogo}
            alt="Google Logo"
            width={24}
            height={24}
            style={{ marginRight: 6 }}
          ></Image>
          Continue With Google
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
