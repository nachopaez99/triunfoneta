import { getBackendFileUrl } from "../../services/userService";

export function PersonalStickerCard({ sticker, fallbackName }) {
  const imageUrl = getBackendFileUrl(
    sticker?.photoUrl || sticker?.imageUrl || sticker?.avatarUrl
  );

  return (
    <div className="personal-sticker-card">
      <div className="personal-sticker-image">
        {imageUrl ? (
          <img src={imageUrl} alt={sticker?.nickname || fallbackName} />
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