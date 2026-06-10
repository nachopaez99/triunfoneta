import { apiRequest } from "./apiClient";

export function getProdeMatches() {
  return apiRequest("/prode/matches");
}

export function createProdePick(matchId, payload) {
  return apiRequest(`/prode/matches/${matchId}/pick`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMyProdePicks() {
  return apiRequest("/prode/picks/me");
}s