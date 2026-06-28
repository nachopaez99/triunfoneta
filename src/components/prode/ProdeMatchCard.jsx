function formatDateTime(dateString) {
  if (!dateString) return { date: "Sin fecha", time: "" };

  const date = new Date(dateString);

  return {
    date: date.toLocaleDateString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("es-AR", {
      timeZone: "America/Argentina/Buenos_Aires",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

function getMatchStatus(match) {
  const now = new Date();

  if (match.isFinished) return "finished";

  if (match.picksCloseAt && new Date(match.picksCloseAt) <= now) {
    return "locked";
  }

  return "open";
}

export function ProdeMatchCard({
  match,
  onPredictionChange,
  onSavePrediction,
}) {
  const matchDate = formatDateTime(match.matchDate);
  const status = getMatchStatus(match);

  return (
    <article className="prode-card">
      <div className="prode-card__header">
        <span>{matchDate.date}</span>
        <strong>{matchDate.time}</strong>
      </div>

      <div className="prode-card__meta">
        <span>{match.stage}</span>
        {match.stage?.toLowerCase() === "fase de grupos" && match.group && (
  <strong> - Grupo {match.group}</strong>
)}
      </div>

      <div className="prode-card__teams">
        <span>{match.homeTeam}</span>
        <span>vs</span>
        <span>{match.awayTeam}</span>
      </div>

      <div className="prode-card__prediction">
        <input
          type="number"
          min="0"
          disabled={status !== "open" || match.isDisabled || match.hasPick}
          value={match.prediction.homeScore}
          onChange={(event) =>
            onPredictionChange(match.id, "homeScore", event.target.value)
          }
        />

        <span>-</span>

        <input
          type="number"
          min="0"
          disabled={status !== "open" || match.isDisabled || match.hasPick}
          value={match.prediction.awayScore}
          onChange={(event) =>
            onPredictionChange(match.id, "awayScore", event.target.value)
          }
        />
      </div>

      {status === "finished" && (
        <p className="prode-result">
          Resultado final: {match.scoreHome} - {match.scoreAway}
        </p>
      )}

      <div className="prode-card__footer">
        <span className={`status-badge status-badge--${status}`}>
          {status === "open" && "Abierto"}
          {status === "locked" && "Cerrado"}
          {status === "finished" && "Finalizado"}
        </span>

        {status === "open" && !match.hasPick ? (
          <button
            className="stock-action"
            type="button"
            disabled={match.isDisabled}
            onClick={() => onSavePrediction(match.id)}
          >
            {match.isSaving ? "Guardando..." : "Guardar"}
          </button>
        ) : (
          <strong>{match.pointsEarned ?? 0} pts</strong>
        )}
      </div>
    </article>
  );
}