import { apiRequest } from "./apiClient";

export function getMyMissingStickers() {
  return apiRequest("/album/me/missing");
}

export function getUserMissingStickers(userId) {
  return apiRequest(`/album/${userId}/missing`);
}