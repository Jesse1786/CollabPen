const BACKEND_URL =
  process.env.NEXT_PUBLIC_ENV === "prod"
    ? process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000"
    : "http://localhost:4000";

console.log(BACKEND_URL);

export const register = async (username, email, password) => {
  return fetch(`${BACKEND_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ username, email, password }),
  });
};

export const login = async (username, password) => {
  return fetch(`${BACKEND_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ username, password }),
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

export const checkAuthenticated = async () => {
  return fetch(`${BACKEND_URL}/api/auth/check`, {
    method: "GET",
    credentials: "include",
  });
};

export const addUserProject = async (user, name, description) => {
  return fetch(`${BACKEND_URL}/api/users/${user}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, description }),
  });
};

export const getUserProjects = async (user) => {
  return fetch(`${BACKEND_URL}/api/users/${user}/projects`, {
    method: "GET",
    credentials: "include",
  });
};

export const deleteUserProject = async (user, id) => {
  return fetch(`${BACKEND_URL}/api/users/${user}/projects/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
};
