import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiEye, FiEyeOff } from "react-icons/fi";

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  async function handleSubmit(event) {
  event.preventDefault();

  setError("");
  setLoading(true);

  try {
    await login({ email, password });
    navigate("/");
  } catch (error) {
    setError("Email o contraseña incorrectos.");
  } finally {
    setLoading(false);
  }
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

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </section>
  );
}