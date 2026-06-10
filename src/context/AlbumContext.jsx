import { createContext, useContext, useEffect, useState } from "react";
import { getMySticker } from "../services/userService";
import { stickersMock } from "../data/stickers.mock";
import { userMock } from "../data/user.mock";
import { triviaMock } from "../data/trivia.mock";
import { TRIVIA_POINTS } from "../config/trivia.config";
import { getAreas } from "../services/areaService";

import {
  getAlbumProgress,
  getMyCollection,
  getMyDuplicates,
  openPackFromBackend,
} from "../services/packService";

const AlbumContext = createContext(null);

const PACK_COST = 150;
const STICKERS_PER_PACK = 5;

export function AlbumProvider({ children }) {
  const [stickers, setStickers] = useState(stickersMock);
  const [user, setUser] = useState(userMock);
  const [lastOpenedPack, setLastOpenedPack] = useState([]);
  const [trivias, setTrivias] = useState(triviaMock);
  const [backendAreas, setBackendAreas] = useState([]);
  /* const [albumStickers, setAlbumStickers] = useState([]); */
  const [albumProgress, setAlbumProgress] = useState([]);
  const [collection, setCollection] = useState([]);
  const [duplicates, setDuplicates] = useState([]);
  /* const [areas, setAreas] = useState([]); */

  useEffect(() => {
  async function loadAuthenticatedUser() {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    try {
      const [
        areasFromBackend,
        progressFromBackend,
        collectionFromBackend,
        duplicatesFromBackend,
      ] = await Promise.all([
        getAreas(),
        getAlbumProgress(),
        getMyCollection(),
        getMyDuplicates(),
      ]);

      setBackendAreas(areasFromBackend);
      setAlbumProgress(progressFromBackend);
      setCollection(collectionFromBackend.data || []);
      setDuplicates(duplicatesFromBackend.data || []);
    } catch (error) {
      console.error("Error cargando datos iniciales:", error);
    }

    try {
      const backendSticker = await getMySticker();

      setUser((currentUser) => ({
        ...currentUser,
        personalSticker: {
          stickerId: backendSticker.id,
          photoUrl: backendSticker.photoUrl,
          phrase: backendSticker.funFact || "",
        },
      }));
    } catch {
      setUser((currentUser) => ({
        ...currentUser,
        personalSticker: null,
      }));
    }
  }

  loadAuthenticatedUser();
}, []);

  function pasteSticker(stickerId) {
    setStickers((currentStickers) =>
      currentStickers.map((sticker) => {
        if (sticker.id !== stickerId) {
          return sticker;
        }

        return {
          ...sticker,
          isPasted: true,
          quantity: Math.max(sticker.quantity - 1, 0),
        };
      })
    );
  }

  function getRandomSticker(currentStickers) {
    const randomIndex = Math.floor(Math.random() * currentStickers.length);
    return currentStickers[randomIndex];
  }

  async function openPack() {
  try {
    const response = await openPackFromBackend();

    const openedStickers = response.stickers.map((sticker) => ({
      id: sticker.id,
      number: sticker.stickerNumber,
      employeeName: sticker.nickname,
      department: sticker.area,
      position: "Figurita",
      rarity: "common",
      imageUrl: sticker.photoUrl || null,
      isOwned: true,
      isPasted: true,
      quantity: 1,
    }));

    setLastOpenedPack(openedStickers);

    try {
      const updatedProgress = await getAlbumProgress();
      setAlbumProgress(updatedProgress);
    } catch (error) {
      console.error("Error actualizando progreso:", error);
    }

    try {
      const updatedCollection = await getMyCollection();
      setCollection(updatedCollection.data || []);
    } catch (error) {
      console.error("Error actualizando colección:", error);
    }

    try {
      const updatedDuplicates = await getMyDuplicates();
      setDuplicates(updatedDuplicates.data || []);
    } catch (error) {
      console.error("Error actualizando repetidas:", error);
    }

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
}
}

  const totalStickers = stickers.length;
  const pastedStickers = stickers.filter((sticker) => sticker.isPasted).length;
  const repeatedStickers = stickers.filter((sticker) => sticker.quantity > 1);
  const newStickers = stickers.filter(
    (sticker) => sticker.isOwned && !sticker.isPasted
  );

  const progress = Math.round((pastedStickers / totalStickers) * 100);

  function getRandomTrivia() {
  const availableTrivias = trivias.filter((trivia) => !trivia.answered);

  if (availableTrivias.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableTrivias.length);
  return availableTrivias[randomIndex];
  }

  function answerTrivia(triviaId, selectedAnswer) {
  const trivia = trivias.find((item) => item.id === triviaId);

  if (!trivia || trivia.answered) {
    return {
      isCorrect: false,
      pointsEarned: 0,
    };
  }

  const isCorrect = trivia.correctAnswer === selectedAnswer;
  const pointsEarned = isCorrect ? TRIVIA_POINTS[trivia.difficulty] : 0;

  setTrivias((currentTrivias) =>
    currentTrivias.map((item) => {
      if (item.id !== triviaId) {
        return item;
      }

      return {
        ...item,
        answered: true,
        selectedAnswer,
        isCorrect,
        pointsEarned,
      };
    })
  );

  if (isCorrect) {
    setUser((currentUser) => ({
      ...currentUser,
      points: currentUser.points + pointsEarned,
    }));
  }

  return {
    isCorrect,
    pointsEarned,
  };
}

  const value = {
    user,
    stickers,
    totalStickers,
    pastedStickers,
    repeatedStickers,
    newStickers,
    progress,
    packCost: PACK_COST,
    stickersPerPack: STICKERS_PER_PACK,
    lastOpenedPack,
    pasteSticker,
    openPack,
    setUser,
    trivias,
    getRandomTrivia,
    answerTrivia,
    backendAreas,
    /* albumStickers, */
    albumProgress,
    collection,
    duplicates,
    };

    return (
    <AlbumContext.Provider value={value}>{children}</AlbumContext.Provider>
  );
}

export function useAlbum() {
  const context = useContext(AlbumContext);

  if (!context) {
    throw new Error("useAlbum debe usarse dentro de AlbumProvider");
  }

  return context;
}

