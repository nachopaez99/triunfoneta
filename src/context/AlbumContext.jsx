import { createContext, useContext, useEffect, useState } from "react";
import { getAreas } from "../services/areaService";
import { getGameConfig } from "../services/configService";
import { getUsers } from "../services/userService";
/* import { getUsers } from "../services/userService"; */
import { useAuth } from "./AuthContext";

import {
  getAlbumProgress,
  getMyCollection,
  getMyDuplicates,
  openPackFromBackend,
} from "../services/packService";

const AlbumContext = createContext(null);

const ALBUM_CACHE_KEY = "albumData";
const LAST_PACK_CACHE_KEY = "lastOpenedPack";
const GAME_CONFIG_CACHE_KEY = "gameConfig";


const DEFAULT_GAME_CONFIG = {
  packCost: 150,
  stickersPerPack: 5,
  stickerCreationPoints: 500,
  prodeExactPoints: 100,
  prodeWinnerPoints: 70,
  areaCompletionPoints: 100,
  packLegendChance: 0.1,
};

function safeParseJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function getConfigValue(configs, type, fallback = 0) {
  if (!Array.isArray(configs)) return fallback;

  const config = configs.find((item) => item.type === type);
  const value = Number(config?.value);

  return Number.isFinite(value) ? value : fallback;
}

function normalizeCollectionResponse(response) {
  return response?.data || [];
}

function normalizeUsersResponse(response) {
  return response?.data || response || [];
}

function getUserNameById(users, userId) {
  return users.find((user) => user.id === userId)?.fullName || null;
}

function enrichCollectionWithUsers(collection, users) {
  return collection.map((item) => {
    const fullName =
      item.sticker?.fullName ||
      item.sticker?.user?.fullName ||
      getUserNameById(users, item.sticker?.userId);

    return {
      ...item,
      sticker: {
        ...item.sticker,
        fullName,
        nickname: item.sticker?.nickname || fullName || null,
      },
    };
  });
}

export function AlbumProvider({ children }) {
  const [backendAreas, setBackendAreas] = useState([]);
  const [albumProgress, setAlbumProgress] = useState([]);
  const [collection, setCollection] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  const [isAlbumLoading, setIsAlbumLoading] = useState(false);
  const [isOpeningPack, setIsOpeningPack] = useState(false);
  const [isConfigLoading, setIsConfigLoading] = useState(false);
  const { user } = useAuth();

  const [lastOpenedPack, setLastOpenedPack] = useState(() =>
  safeParseJson(sessionStorage.getItem(LAST_PACK_CACHE_KEY), [])
);

const [gameConfig, setGameConfig] = useState(() =>
  safeParseJson(
    sessionStorage.getItem(GAME_CONFIG_CACHE_KEY),
    DEFAULT_GAME_CONFIG
  )
);
  async function refreshGameConfig() {
  setIsConfigLoading(true);

  try {
    const configs = await getGameConfig();

    const nextGameConfig = {
      packCost: getConfigValue(configs, "PACK_COST_POINTS", DEFAULT_GAME_CONFIG.packCost),
      stickersPerPack: getConfigValue(configs, "PACK_STICKERS_PER_PACK", DEFAULT_GAME_CONFIG.stickersPerPack),
      stickerCreationPoints: getConfigValue(configs, "STICKER_CREATION_POINTS", DEFAULT_GAME_CONFIG.stickerCreationPoints),
      prodeExactPoints: getConfigValue(configs, "PRODE_EXACT_POINTS", DEFAULT_GAME_CONFIG.prodeExactPoints),
      prodeWinnerPoints: getConfigValue(configs, "PRODE_WINNER_POINTS", DEFAULT_GAME_CONFIG.prodeWinnerPoints),
      areaCompletionPoints: getConfigValue(configs, "AREA_COMPLETION_POINTS", DEFAULT_GAME_CONFIG.areaCompletionPoints),
      packLegendChance: getConfigValue(configs, "PACK_LEGEND_CHANCE", DEFAULT_GAME_CONFIG.packLegendChance),
    };

    setGameConfig(nextGameConfig);
    sessionStorage.setItem(
  GAME_CONFIG_CACHE_KEY,
  JSON.stringify(nextGameConfig)
);
    return nextGameConfig;
  } catch (error) {
    console.error("Error cargando config del juego:", error);
    return gameConfig;
  } finally {
    setIsConfigLoading(false);
  }
}

  /* async function refreshGameConfig() {
    try {
      const configs = await getGameConfig();

      const nextGameConfig = {
        packCost: getConfigValue(configs, "PACK_COST_POINTS", DEFAULT_GAME_CONFIG.packCost),
        stickersPerPack: getConfigValue(
          configs,
          "PACK_STICKERS_PER_PACK",
          DEFAULT_GAME_CONFIG.stickersPerPack
        ),
        stickerCreationPoints: getConfigValue(
          configs,
          "STICKER_CREATION_POINTS",
          DEFAULT_GAME_CONFIG.stickerCreationPoints
        ),
        prodeExactPoints: getConfigValue(
          configs,
          "PRODE_EXACT_POINTS",
          DEFAULT_GAME_CONFIG.prodeExactPoints
        ),
        prodeWinnerPoints: getConfigValue(
          configs,
          "PRODE_WINNER_POINTS",
          DEFAULT_GAME_CONFIG.prodeWinnerPoints
        ),
        areaCompletionPoints: getConfigValue(
          configs,
          "AREA_COMPLETION_POINTS",
          DEFAULT_GAME_CONFIG.areaCompletionPoints
        ),
        packLegendChance: getConfigValue(
          configs,
          "PACK_LEGEND_CHANCE",
          DEFAULT_GAME_CONFIG.packLegendChance
        ),
      };

      setGameConfig(nextGameConfig);
      localStorage.setItem(GAME_CONFIG_CACHE_KEY, JSON.stringify(nextGameConfig));

      return nextGameConfig;
    } catch (error) {
      console.error("Error cargando config del juego:", error);
      return gameConfig;
    }
  } */

  async function refreshAlbumData() {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    setIsAlbumLoading(true);

    try {
      const [
  areasFromBackend,
  progressFromBackend,
  collectionFromBackend,
  duplicatesFromBackend,
  usersFromBackend,
] = await Promise.all([
  getAreas(),
  getAlbumProgress(),
  getMyCollection(),
  getMyDuplicates(),
  getUsers(),
]);

const users = normalizeUsersResponse(usersFromBackend);

      const nextAlbumData = {
        backendAreas: Array.isArray(areasFromBackend) ? areasFromBackend : [],
        albumProgress: Array.isArray(progressFromBackend)
          ? progressFromBackend
          : [],
        collection: enrichCollectionWithUsers(
  normalizeCollectionResponse(collectionFromBackend),
  users
),
duplicates: enrichCollectionWithUsers(
  Array.isArray(duplicatesFromBackend)
    ? duplicatesFromBackend
    : normalizeCollectionResponse(duplicatesFromBackend),
  users
),
      };

      setBackendAreas(nextAlbumData.backendAreas);
      setAlbumProgress(nextAlbumData.albumProgress);
      setCollection(nextAlbumData.collection);
      setDuplicates(nextAlbumData.duplicates);

      sessionStorage.setItem(
  ALBUM_CACHE_KEY,
  JSON.stringify(nextAlbumData)
);
    } catch (error) {
      console.error("Error actualizando álbum:", error);
    } finally {
      setIsAlbumLoading(false);
    }
  }

  useEffect(() => {
  if (!user?.id) return;

  const cachedAlbum = safeParseJson(sessionStorage.getItem(ALBUM_CACHE_KEY), null);

  if (cachedAlbum) {
    setBackendAreas(cachedAlbum.backendAreas || []);
    setAlbumProgress(cachedAlbum.albumProgress || []);
    setCollection(cachedAlbum.collection || []);
    setDuplicates(cachedAlbum.duplicates || []);
  }

  refreshGameConfig();
  refreshAlbumData();
}, [user?.id]);

  async function pasteSticker() {
    await refreshAlbumData();
  }

  async function openPack() {
    if (isOpeningPack) return null;

    setIsOpeningPack(true);

    try {
  const response = await openPackFromBackend();

  console.log("PACK RESPONSE:", response);
  console.log("PACK STICKERS:", response.stickers);

  const usersResponse = await getUsers();
const users = usersResponse.data || usersResponse || [];

const openedStickers = response.stickers.map((sticker) => {
  const user = users.find((item) => item.id === sticker.userId);

  const displayName =
    sticker.nickname ||
    sticker.fullName ||
    sticker.user?.fullName ||
    user?.fullName ||
    "Usuario";

  return {
    id: sticker.id,
    nickname: displayName,
    fullName: user?.fullName || sticker.fullName || null,

    area: sticker.area,
    stickerNumber: sticker.stickerNumber,
    photoUrl: sticker.photoUrl,
    avatarUrl: sticker.avatarUrl,

    number: sticker.stickerNumber,
    employeeName: displayName,
    department: sticker.area,

    rarity: sticker.rarity || "common",
    isLegend:
      sticker.isLegend === true ||
      sticker.rarity === "legend" ||
      sticker.rarity === "legendary",

    quantity: 1,
  };
});

      setLastOpenedPack(openedStickers);
      sessionStorage.setItem(
  LAST_PACK_CACHE_KEY,
  JSON.stringify(openedStickers)
);

      await refreshAlbumData();

      return openedStickers;
    } catch (error) {
      console.error("Error abriendo sobre:", error);

      let message = "No se pudo abrir el sobre.";

      try {
        const parsedError = JSON.parse(error.message);
        message = parsedError.message || message;
      } catch {
        message = error.message || message;
      }
      

      alert(message);

      return null;
    } finally {
      setIsOpeningPack(false);
    }




  }

  const totalStickers = albumProgress.reduce(
    (total, area) => total + area.totalStickers,
    0
  );

  const pastedStickers = albumProgress.reduce(
    (total, area) => total + area.ownedStickers,
    0
  );

  const repeatedStickers = collection.filter((item) => item.quantity > 1);
  const newStickers = collection.filter((item) => item.quantity > 0);

  const progress =
    totalStickers > 0 ? Math.round((pastedStickers / totalStickers) * 100) : 0;

  const value = {
    totalStickers,
    pastedStickers,
    repeatedStickers,
    newStickers,
    progress,

    packCost: gameConfig.packCost,
    stickersPerPack: gameConfig.stickersPerPack,
    gameConfig,

    lastOpenedPack,
    isAlbumLoading,
    isOpeningPack,

    backendAreas,
    albumProgress,
    collection,
    duplicates,

    pasteSticker,
    openPack,
    refreshAlbumData,
    refreshGameConfig,
    isConfigLoading,
  };

  return <AlbumContext.Provider value={value}>{children}</AlbumContext.Provider>;
}

export function useAlbum() {
  const context = useContext(AlbumContext);

  if (!context) {
    throw new Error("useAlbum debe usarse dentro de AlbumProvider");
  }

  return context;
}