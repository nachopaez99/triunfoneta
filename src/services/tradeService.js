import { apiRequest } from "./apiClient";

export function getMyTrades() {
  return apiRequest("/trades/me");
}

export function getUserCollection(userId, options = {}) {
  const params = new URLSearchParams();

  if (options.duplicatesOnly !== undefined) {
    params.set("duplicatesOnly", String(options.duplicatesOnly));
  }

  if (options.area) {
    params.set("area", options.area);
  }

  params.set("page", String(options.page || 1));
  params.set("limit", String(options.limit || 50));

  return apiRequest(`/packs/collection/${userId}?${params.toString()}`);
}

export function createTrade(payload) {
  return apiRequest("/trades", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function acceptTrade(tradeId) {
  return apiRequest(`/trades/${tradeId}/accept`, {
    method: "PATCH",
  });
}

export function rejectTrade(tradeId) {
  return apiRequest(`/trades/${tradeId}/reject`, {
    method: "PATCH",
  });
}

export function cancelTrade(tradeId) {
  return apiRequest(`/trades/${tradeId}/cancel`, {
    method: "PATCH",
  });
}