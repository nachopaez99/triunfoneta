import { getUserImageUrl } from "../../services/userService";

export function PersonalStickerCard({ sticker, fallbackName }) {
  const displayName =
    sticker?.nickname ||
    sticker?.fullName ||
    sticker?.user?.fullName ||
    sticker?.employeeName ||
    fallbackName ||
    "Usuario";

  const imageUrl = getUserImageUrl(
    sticker?.photoUrl || sticker?.imageUrl,
    sticker?.avatarUrl
  );

  return (
    <div className="personal-sticker-card">
      <div className="personal-sticker-image">
        <img src={imageUrl} alt={displayName} />
      </div>

      <h3>{displayName}</h3>

      <p>{sticker?.position || "Empleado Triunfo"}</p>

      <strong>{sticker?.area || "Sin área"}</strong>

      {sticker?.funFact && <blockquote>{sticker.funFact}</blockquote>}
    </div>
  );
}