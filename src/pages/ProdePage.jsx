import { useEffect, useState } from "react";

import { ProdeMatchCard } from "../components/prode/ProdeMatchCard";
import {
  createProdePick,
  getMyProdePicks,
  getProdeMatches,
} from "../services/prodeService";

const PRODE_CACHE_KEY = "prodeData";

function safeParseJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeProdeData(matchesResponse, picksResponse) {
  const backendMatches = matchesResponse.data || matchesResponse || [];
  const backendPicks = picksResponse.data || picksResponse || [];

  return {
    picks: backendPicks,
    matches: backendMatches.map((match) => {
      const existingPick = backendPicks.find(
        (pick) => pick.matchId === match.id || pick.match?.id === match.id
      );

      return {
  ...match,
  prediction: {
    homeScore:
      existingPick?.predictedHome ??
      existingPick?.homeScore ??
      "",
    awayScore:
      existingPick?.predictedAway ??
      existingPick?.awayScore ??
      "",
  },
  hasPick: Boolean(existingPick),
  pointsEarned:
    existingPick?.pointsEarned ??
    existingPick?.points ??
    match.pointsEarned ??
    0,
};
    }),
  };
}

export function ProdePage() {
  const cachedProde = safeParseJson(sessionStorage.getItem(PRODE_CACHE_KEY), null);

  const [matches, setMatches] = useState(cachedProde?.matches || []);
  const [picks, setPicks] = useState(cachedProde?.picks || []);
  const [loading, setLoading] = useState(!cachedProde);
  const [savingMatchId, setSavingMatchId] = useState(null);
  const [error, setError] = useState("");

  async function loadProde({ showLoading = true } = {}) {
    if (showLoading) {
      setLoading(true);
    }

    setError("");

    try {
      const [matchesResponse, picksResponse] = await Promise.all([
        getProdeMatches(),
        getMyProdePicks(),
      ]);

      const nextProdeData = normalizeProdeData(matchesResponse, picksResponse);

      setPicks(nextProdeData.picks);
      setMatches(nextProdeData.matches);

      sessionStorage.setItem(PRODE_CACHE_KEY, JSON.stringify(nextProdeData));
    } catch (error) {
      console.error("Error cargando prode:", error);

      if (!cachedProde) {
        setError(error.message || "No se pudo cargar el prode.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProde({ showLoading: !cachedProde });
  }, []);

  function handlePredictionChange(matchId, field, value) {
    setMatches((currentMatches) =>
      currentMatches.map((match) => {
        if (match.id !== matchId) return match;

        return {
          ...match,
          prediction: {
            ...match.prediction,
            [field]: value,
          },
        };
      })
    );
  }

  async function handleSavePrediction(matchId) {
    const match = matches.find((item) => item.id === matchId);

    if (!match) return;

    const homeScore = Number(match.prediction.homeScore);
    const awayScore = Number(match.prediction.awayScore);

    if (!Number.isInteger(homeScore) || !Number.isInteger(awayScore)) {
      alert("Ingresá un resultado válido.");
      return;
    }

    setSavingMatchId(matchId);

    try {
      await createProdePick(matchId, {
        predictedHome: homeScore,
        predictedAway: awayScore,
      });

      await loadProde({ showLoading: false });

      alert("Pronóstico guardado.");
    } catch (error) {
      console.error("Error guardando pronóstico:", error);
      alert(error.message || "No se pudo guardar el pronóstico.");
    } finally {
      setSavingMatchId(null);
    }
  }

  if (loading) {
    return (
      <section className="page">
        <p>Cargando prode...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <section className="empty-state">
          <h3>Ocurrió un error</h3>
          <p>{error}</p>
          <button className="primary-button" type="button" onClick={loadProde}>
            Reintentar
          </button>
        </section>
      </section>
    );
  }

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <h2>Prode Mundialista</h2>
          <p>Pronosticá resultados y sumá puntos si acertás.</p>
        </div>
      </header>

      <div className="prode-grid">
        {matches.map((match) => (
          <ProdeMatchCard
            key={match.id}
            match={{
              ...match,
              isSaving: savingMatchId === match.id,
            }}
            onPredictionChange={handlePredictionChange}
            onSavePrediction={handleSavePrediction}
          />
        ))}
      </div>
    </section>
  );
}