import { apiRequest } from "./apiClient";

export function getMyPoints() {
  return apiRequest("/points/me");
}