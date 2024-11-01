import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

/* 
Wrapper that provides the user object and login/logout functions nested components

Note: AuthProvider does not handle any redirects, it only provides the user object and login/logout functions
Redirects are handled in the components that use the AuthProvider
*/
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Used to prevent rendering before auth checks are done

  useEffect(() => {
    // Check if the user is authenticated on initial load
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/auth/check", {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.username);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);


  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
