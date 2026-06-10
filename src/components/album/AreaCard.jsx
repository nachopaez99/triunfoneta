import { Link } from "react-router-dom";

export function AreaCard({ area, completed, total, color }) {
  const progress = Math.round((completed / total) * 100);

  return (
    <Link to={`/album/${area.toLowerCase()}`} className="area-card">
      <div className="area-card__accent" style={{ backgroundColor: color }} />

      <h3>{area}</h3>

      <div className="area-card__slots">
        {Array.from({ length: Math.min(total, 12) }).map((_, index) => (
          <span
            key={index}
            className={index < completed ? "slot completed" : "slot"}
            style={index < completed ? { backgroundColor: color } : undefined}
          />
        ))}
      </div>

      <p>{completed}/{total} pegadas</p>

      <div className="area-progress">
        <div
          className="area-progress__fill"
          style={{ width: `${progress}%`, backgroundColor: color }}
        />
      </div>
    </Link>
  );
}