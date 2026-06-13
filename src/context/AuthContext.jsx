import { createContext, useContext, useEffect, useState } from "react";
import { login as loginRequest } from "../services/authService";
import { getCurrentUser, getMySticker } from "../services/userService";

const AuthContext = createContext(null);

const TOKEN_KEY = "accessToken";
const USER_CACHE_KEY = "user";
const MY_STICKER_CACHE_KEY = "mySticker";

function safeParseJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    safeParseJson(sessionStorage.getItem(USER_CACHE_KEY), null)
  );

  const [mySticker, setMySticker] = useState(() =>
    safeParseJson(sessionStorage.getItem(MY_STICKER_CACHE_KEY), null)
  );

  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = Boolean(token && user);

  async function refreshUser() {
    const backendUser = await getCurrentUser();

    setUser(backendUser);
    sessionStorage.setItem(USER_CACHE_KEY, JSON.stringify(backendUser));

    return backendUser;
  }

  async function refreshMySticker() {
    try {
      const sticker = await getMySticker();

      setMySticker(sticker);
      sessionStorage.setItem(MY_STICKER_CACHE_KEY, JSON.stringify(sticker));

      return sticker;
    } catch (error) {
      setMySticker(null);
      sessionStorage.removeItem(MY_STICKER_CACHE_KEY);
      return null;
    }
  }

  useEffect(() => {
    async function loadSession() {
      if (!token) {
        setUser(null);
        setMySticker(null);
        setIsLoading(false);
        return;
      }

      try {
        await refreshUser();
        await refreshMySticker();
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        sessionStorage.removeItem(USER_CACHE_KEY);
        sessionStorage.removeItem(MY_STICKER_CACHE_KEY);

        setToken(null);
        setUser(null);
        setMySticker(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadSession();
  }, [token]);

  async function login(credentials) {
    const response = await loginRequest(credentials);

    sessionStorage.clear();


    localStorage.setItem(TOKEN_KEY, response.accessToken);
    setToken(response.accessToken);

    const backendUser = await refreshUser();
    await refreshMySticker();

    return backendUser;
  }

  function logout() {
  sessionStorage.clear();

  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  localStorage.removeItem("albumData");
  localStorage.removeItem("lastOpenedPack");
  localStorage.removeItem("gameConfig");
  localStorage.removeItem("mySticker");

  setToken(null);
  setUser(null);
}

  const value = {
    user,
    mySticker,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
    refreshMySticker,
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