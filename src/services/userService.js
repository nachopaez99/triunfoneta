/* import { apiRequest } from "./apiClient";

const API_URL = import.meta.env.VITE_API_URL;

export function getCurrentUser() {
  return apiRequest(`/users/me`);
}

export function getMySticker() {
  return apiRequest(`/users/me/sticker`);
}

export function getUsers() {
  return apiRequest("/users");
}

export function createMySticker(payload) {
  return apiRequest("/users/me/sticker", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function uploadMyStickerPhoto(file) {
  const token = localStorage.getItem("accessToken");

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/users/me/sticker/photo`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || "No se pudo subir la foto.");
  }

  return text ? JSON.parse(text) : null;
}

export function getBackendFileUrl(fileUrl) {
  if (!fileUrl) return "";

  if (fileUrl.startsWith("http")) {
    return fileUrl;
  }

  const API_URL = import.meta.env.VITE_API_URL;
  const BACKEND_URL = API_URL.replace("/api", "");

  return `${BACKEND_URL}${fileUrl}`;
} */
import { apiRequest } from "./apiClient";
import defaultAvatar from "../assets/defaultAvatar.png"


const API_URL = import.meta.env.VITE_API_URL;
const BACKEND_URL = API_URL.replace("/api", "");

export function getBackendFileUrl(fileUrl) {
  if (!fileUrl) return "";

  if (
    fileUrl.startsWith("http") ||
    fileUrl.startsWith("blob:") ||
    fileUrl.startsWith("data:")
  ) {
    return fileUrl;
  }

  if (fileUrl.startsWith("/uploads/")) {
    return `${BACKEND_URL}${fileUrl}`;
  }

  if (fileUrl.startsWith("/")) {
    return fileUrl;
  }

  return fileUrl;
}

export function getUserImageUrl(photoUrl, avatarUrl) {
  return (
    getBackendFileUrl(photoUrl) ||
    getBackendFileUrl(avatarUrl) ||
    defaultAvatar
  );
}

export function getCurrentUser() {
  return apiRequest("/users/me");
}

export function getMySticker() {
  return apiRequest("/users/me/sticker");
}

export function getUsers() {
  return apiRequest("/users?page=1&limit=1000");
}

export function createMySticker(payload) {
  return apiRequest("/users/me/sticker", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function uploadMyStickerPhoto(file) {
  const token = localStorage.getItem("accessToken");

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/users/me/sticker/photo`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(text || "No se pudo subir la foto.");
  }

  return text ? JSON.parse(text) : null;
}

export function updateMySticker(payload) {
  return apiRequest("/users/me/sticker", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
/* export function getUserImageUrl(photoUrl, avatarUrl) {
  return (
    getBackendFileUrl(photoUrl) ||
    getBackendFileUrl(avatarUrl) ||
    "/default-avatar.png"
  );
} */