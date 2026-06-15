import { apiRequest } from "./apiClient";

export function getBanners() {
  return apiRequest("/banners");
}

export function markBannerAsRead(bannerId) {
  return apiRequest(`/banners/${bannerId}/read`, {
    method: "POST",
  });
}

export function getAdminBanners() {
  return apiRequest("/admin/banners");
}

export function createAdminBanner(payload) {
  return apiRequest("/admin/banners", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}