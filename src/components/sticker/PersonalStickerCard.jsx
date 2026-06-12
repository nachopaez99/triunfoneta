/* import { getBackendFileUrl } from "../../services/userService"; */
import { getUserImageUrl } from "../../services/userService";
import defaultAvatar from "../../assets/defaultAvatar.png"

const DEFAULT_AVATAR_URL = defaultAvatar;

export function PersonalStickerCard({ sticker, fallbackName }) {
  const imageUrl = getUserImageUrl(
  sticker?.photoUrl || sticker?.imageUrl,
  sticker?.avatarUrl
);

  return (
    <div className="personal-sticker-card">
      <div className="personal-sticker-image">
        <img
          src={imageUrl}
          alt={sticker?.nickname || fallbackName || "Avatar"}
        />
      </div>

      <h3>{sticker?.nickname || fallbackName}</h3>

      <p>{sticker?.position || "Sin puesto"}</p>

      <strong>{sticker?.area || "Sin área"}</strong>

      {sticker?.funFact && <blockquote>{sticker.funFact}</blockquote>}
    </div>
  );
}