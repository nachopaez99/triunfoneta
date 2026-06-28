import { apiRequest } from "./apiClient";

export function getProdeRanking() {
  return apiRequest("/rankings/prode?limit=600");
}