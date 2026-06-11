import { apiRequest } from "./apiClient";

export function getGameConfig() {
  return apiRequest("/configs");
}