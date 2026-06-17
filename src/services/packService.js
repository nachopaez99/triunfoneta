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
  return apiRequest("/packs/collection/me?page=1&limit=1000");
}

export function getMyDuplicates() {
  return apiRequest("/packs/collection/me/duplicates?page=1&limit=1000");
}

export function getMyDuplicateCollection() {
  return apiRequest("/packs/collection/me?duplicatesOnly=true");
}

export function getAlbumSections() {
  return apiRequest("/album/me/section");
}