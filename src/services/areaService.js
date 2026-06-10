import { apiRequest } from "./apiClient";

export function getAreas() {
  return apiRequest("/areas");
}