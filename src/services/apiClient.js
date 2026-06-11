const API_URL = import.meta.env.VITE_API_URL;

function getUserFriendlyError(status, parsedError) {
  if (status === 401) return "Tu sesión expiró. Volvé a iniciar sesión.";
  if (status === 403) return "No tenés permiso para realizar esta acción.";
  if (status === 404) return "No se encontró el recurso solicitado.";
  if (status >= 500) return "Ocurrió un error en el servidor.";

  if (Array.isArray(parsedError?.message)) {
    return parsedError.message.join(". ");
  }

  return parsedError?.message || "No se pudo completar la operación.";
}

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("accessToken");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();

  let parsedError = null;

  try {
    parsedError = text ? JSON.parse(text) : null;
  } catch {
    parsedError = null;
  }

  if (!response.ok) {
    throw new Error(getUserFriendlyError(response.status, parsedError));
  }

  return text ? JSON.parse(text) : null;
}