import { apiRequest } from "./apiClient";

export function getMyTrades() {
  return apiRequest("/trades/me");
}

export function createTrade(payload) {
  return apiRequest("/trades", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getUserCollection(userId) {
  return apiRequest(`/packs/collection/${userId}`);
}