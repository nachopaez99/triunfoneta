import { apiRequest } from "./apiClient";
/* const API_URL = import.meta.env.VITE_API_URL; */

export function getCurrentUser() {
  return apiRequest(`/users/me`);
}

export function getMySticker() {
  return apiRequest(`/users/me/sticker`);
}

export function getUsers() {
  return apiRequest("/users");
}