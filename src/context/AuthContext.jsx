import { createContext, useContext, useEffect, useState } from "react";
import { login as loginRequest } from "../services/authService";
import { getCurrentUser } from "../services/userService";

const AuthContext = createContext(null);

const TOKEN_KEY = "accessToken";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(token && user);

  useEffect(() => {
    async function loadSession() {
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const backendUser = await getCurrentUser();
        setUser(backendUser);
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, [token]);


async function refreshUser() {
  const backendUser = await getCurrentUser();
  setUser(backendUser);
  return backendUser;
}

  async function login(credentials) {
    const response = await loginRequest(credentials);

    localStorage.setItem(TOKEN_KEY, response.accessToken);
    setToken(response.accessToken);

    const backendUser = await getCurrentUser();
    setUser(backendUser);

    return backendUser;
  }

/*   function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  } */
  function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  localStorage.removeItem("albumData");
  localStorage.removeItem("lastOpenedPack");
  localStorage.removeItem("gameConfig");

  setToken(null);
  setUser(null);
}

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}