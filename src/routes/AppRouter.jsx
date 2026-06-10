import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { AppLayout } from "../components/layout/AppLayout";
import { LoginPage } from "../pages/LoginPage";
import { HomePage } from "../pages/HomePage";
import { AlbumPage } from "../pages/AlbumPage";
import { TriviaPage } from "../pages/TriviaPage";
import { ProdePage } from "../pages/ProdePage";
import { ExchangePage } from "../pages/ExchangePage";
import { ProfilePage } from "../pages/ProfilePage";

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export function AppRouter() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="album" element={<AlbumPage />} />
        <Route path="trivias" element={<TriviaPage />} />
        <Route path="prode" element={<ProdePage />} />
        <Route path="intercambio" element={<ExchangePage />} />
        <Route path="perfil" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}