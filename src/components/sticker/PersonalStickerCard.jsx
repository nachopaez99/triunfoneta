export function PersonalStickerCard({ sticker, fallbackName }) {
  return (
    <div className="personal-sticker-card">
      <div className="personal-sticker-image">
        {sticker?.photoUrl ? (
          <img src={sticker.photoUrl} alt={sticker.nickname || fallbackName} />
        ) : (
          "?"
        )}
      </div>

      <h3>{sticker?.nickname || fallbackName}</h3>

      <p>{sticker?.position || "Sin puesto"}</p>

      <strong>{sticker?.area || "Sin área"}</strong>

      {sticker?.funFact && <blockquote>{sticker.funFact}</blockquote>}
    </div>
  );
}