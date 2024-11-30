const BACKEND_URL =
  process.env.NEXT_PUBLIC_ENV === "prod"
    ? process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
    : "http://localhost:4000";

export const register = async (email, password) => {
  return fetch(`${BACKEND_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
};

export const login = async (email, password) => {
  return fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
};

export const logout = async () => {
  return fetch(`${BACKEND_URL}/api/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
};

export const googleLogin = async () => {
  window.location.href = `${BACKEND_URL}/api/auth/google`;
};

export const googleCallback = async () => {
  return fetch(`${BACKEND_URL}/api/auth/google/callback`, {
    method: "GET",
    credentials: "include",
  });
};

export const checkAuthenticated = async () => {
  return fetch(`${BACKEND_URL}/api/auth/check`, {
    method: "GET",
    credentials: "include",
  });
};

export const addUserProject = async (userId, name, description) => {
  return fetch(`${BACKEND_URL}/api/users/${userId}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, description }),
  });
};

export const getUserProjects = async (userId) => {
  return fetch(`${BACKEND_URL}/api/users/${userId}/projects`, {
    method: "GET",
    credentials: "include",
  });
};

export const deleteUserProject = async (userId, id) => {
  return fetch(`${BACKEND_URL}/api/users/${userId}/projects/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
};
