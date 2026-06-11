import { useEffect, useState } from "react";

import { ProdeMatchCard } from "../components/prode/ProdeMatchCard";
import {
  createProdePick,
  getMyProdePicks,
  getProdeMatches,
} from "../services/prodeService";

export function ProdePage() {
  const [matches, setMatches] = useState([]);
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingMatchId, setSavingMatchId] = useState(null);
  const [error, setError] = useState("");



  async function loadProde() {
    setLoading(true);
    setError("");

    try {
      const [matchesResponse, picksResponse] = await Promise.all([
        getProdeMatches(),
        getMyProdePicks(),
      ]);

      const backendMatches = matchesResponse.data || matchesResponse;
      const backendPicks = picksResponse.data || picksResponse;

      setPicks(backendPicks);

      setMatches(
        backendMatches.map((match) => {
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
          };
        })
      );
    } catch (error) {
      console.error("Error cargando prode:", error);
      setError(error.message || "No se pudo cargar el prode.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProde();
  }, []);

  function handlePredictionChange(matchId, field, value) {
    setMatches((currentMatches) =>
      currentMatches.map((match) => {
        if (match.id !== matchId) {
          return match;
        }

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

      await loadProde();

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