import { apiRequest } from "./apiClient";

export function getUserMissingStickers(userId) {
  return apiRequest(`/album/${userId}/missing`);
}