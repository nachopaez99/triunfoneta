import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProdeRanking } from "../services/rankingService";

import "../styles/pages/ranking.css";

const RANKING_REFRESH_INTERVAL = 5 * 60 * 1000;

function getDisplayName(entry) {
  return (
    entry.user?.fullName ||
    entry.fullName ||
    entry.user?.sticker?.nickName ||
    entry.sticker?.nickName ||
    "Participante"
  );
}

function normalizeRankingEntry(entry, index) {
  return {
    ...entry,
    position: index + 1,
    displayName: getDisplayName(entry),
    totalPoints: Number(entry.totalPoints ?? 0),
  };
}

function getRankVariant(position) {
  if (position === 1) return "gold";
  if (position === 2) return "silver";
  if (position === 3) return "bronze";
  return "default";
}

function getRankIcon(position) {
  if (position === 1) return "🥇";
  if (position === 2) return "🥈";
  if (position === 3) return "🥉";
  return position;
}

export function RankingPage() {
  const { user } = useAuth();

  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadRanking = useCallback(async ({ showInitialLoading = false } = {}) => {
    if (showInitialLoading) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }

    setError("");

    try {
      const response = await getProdeRanking();
      const backendRanking = response.data || response || [];
      const normalizedRanking = backendRanking.map(normalizeRankingEntry);

      setRanking(normalizedRanking);
    } catch (error) {
      console.error("Error cargando ranking prode:", error);
      setError(error.message || "No se pudo cargar el ranking.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadRanking({ showInitialLoading: true });

    const intervalId = setInterval(() => {
      loadRanking({ showInitialLoading: false });
    }, RANKING_REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, [loadRanking]);

  const myRanking = useMemo(() => {
    if (!user?.id) return null;

    return ranking.find((entry) => {
      return (
        entry.id === user.id ||
        entry.userId === user.id ||
        entry.user?.id === user.id
      );
    });
  }, [ranking, user]);

  const myRankVariant = getRankVariant(myRanking?.position);

  if (loading) {
    return (
      <section className="page">
        <section className="empty-state">
          <p>Cargando ranking...</p>
        </section>
      </section>
    );
  }

  return (
    <section className="page ranking-page">
      <header className="ranking-hero">
        <div>
          <span className="ranking-hero__eyebrow">Prode Mundialista</span>
          <h2>Ranking Prode</h2>
          <p>Así viene la tabla de posiciones del prode de Triunfo.</p>
        </div>

        <button
          className="ranking-refresh-button"
          type="button"
          disabled={isRefreshing}
          onClick={() => loadRanking({ showInitialLoading: false })}
        >
          {isRefreshing ? "Actualizando..." : "Actualizar ranking"}
        </button>
      </header>

      {error && (
        <section className="empty-state">
          <h3>Ocurrió un error</h3>
          <p>{error}</p>
        </section>
      )}
{/* --------------------------- Agregar cuando no haya limit en ranking  ---------------------------------------------------------------------- */}
     
     
      {/* <section className="ranking-summary">
        <article className={`ranking-summary-card ranking-summary-card--${myRankVariant}`}>
          <span className="ranking-summary-card__label">Tu puesto</span>
          <strong className="ranking-summary-card__value">
            {myRanking ? `#${myRanking.position}` : "-"}
          </strong>
        </article>

        <article className="ranking-summary-card ranking-summary-card--points">
          <span className="ranking-summary-card__label">Tus puntos</span>
          <strong className="ranking-summary-card__value">
            {myRanking?.totalPoints ?? 0}
          </strong>
        </article>
      </section> */}

      <section className="ranking-panel">
        <div className="ranking-panel__header">
          <div>
            <span className="ranking-panel__eyebrow">Tabla general</span>
            <h3>Top 20</h3>
          </div>
{/* 
          <span className="ranking-panel__counter">
            {ranking.length} participantes
          </span> */}
        </div>

        <div className="ranking-list">
          {ranking.length === 0 && !error ? (
            <section className="empty-state">
              <p>Todavía no hay participantes en el ranking.</p>
            </section>
          ) : (
            ranking.map((entry) => {
              const variant = getRankVariant(entry.position);
              const isMe = myRanking?.id === entry.id;

              return (
                <article
                  className={`ranking-row ranking-row--${variant} ${
                    isMe ? "ranking-row--me" : ""
                  }`}
                  key={entry.id}
                >
                  <div className="ranking-row__position">
                    {getRankIcon(entry.position)}
                  </div>

                  <div className="ranking-row__user">
                    <strong>{entry.displayName}</strong>
                    {isMe && <span>Tu posición actual</span>}
                  </div>

                  <strong className="ranking-row__points">
                    {entry.totalPoints} pts
                  </strong>
                </article>
              );
            })
          )}
        </div>
      </section>
    </section>
  );
}