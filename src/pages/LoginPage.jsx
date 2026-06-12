import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { resetPassword } from "../services/authService";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetError, setResetError] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login({ email, password });
      navigate("/");
    } catch {
      setError("Email o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(event) {
    event.preventDefault();

    if (!resetEmail.trim()) {
      setResetError("Ingresá tu email.");
      return;
    }

    setResetError("");
    setResetMessage("");
    setIsResetting(true);

    try {
      await resetPassword({
        email: resetEmail.trim(),
      });

      setResetMessage(
        "Te enviamos una nueva contraseña a tu correo. Revisá también spam o correo no deseado."
      );
    } catch (error) {
      console.error("Error recuperando contraseña:", error);
      setResetError(error.message || "No se pudo enviar el correo.");
    } finally {
      setIsResetting(false);
    }
  }

  function openResetModal() {
    setResetEmail(email || "");
    setResetError("");
    setResetMessage("");
    setIsResetModalOpen(true);
  }

  function closeResetModal() {
    setIsResetModalOpen(false);
    setResetEmail("");
    setResetError("");
    setResetMessage("");
  }

  return (
    <section className="login-page">
      <div className="login-card">
        <h2>Logueate en la Triunfoneta</h2>
        <p>Viví la locura del mundial corporativo.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Tu email de Triunfo</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <label htmlFor="password">Tu contraseña</label>

          <div className="password-field">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button
            className="forgot-password-button"
            type="button"
            onClick={openResetModal}
          >
            ¿Olvidaste tu contraseña?
          </button>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>

      {isResetModalOpen && (
        <div className="password-modal-backdrop" onClick={closeResetModal}>
          <form
            className="password-modal"
            onSubmit={handleResetPassword}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="password-modal__close"
              type="button"
              onClick={closeResetModal}
            >
              ×
            </button>

            <h3>Recuperar contraseña</h3>

            <p>
              Ingresá tu email y te enviaremos una nueva contraseña temporal.
            </p>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={resetEmail}
                onChange={(event) => setResetEmail(event.target.value)}
                placeholder="tuemail@triunfoseguros.com"
              />
            </div>

            {resetError && <p className="login-error">{resetError}</p>}

            {resetMessage && (
              <p className="profile-status profile-status--approved">
                {resetMessage}
              </p>
            )}

            <button
              className="primary-button"
              type="submit"
              disabled={isResetting}
            >
              {isResetting ? "Enviando..." : "Enviar nueva contraseña"}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}