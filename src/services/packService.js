import { apiRequest } from "./apiClient";

export function openPackFromBackend() {
  return apiRequest("/packs/open", {
    method: "POST",
  });
}

export function getAlbumProgress() {
  return apiRequest("/packs/album/me");
}

export function getMyCollection() {
  return apiRequest("/packs/collection/me");
}

export function getMyDuplicates() {
  return apiRequest("/packs/collection/me/duplicates");
}