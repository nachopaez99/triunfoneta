import { getUserImageUrl } from "../../services/userService";

export function OpenedStickerCard({ sticker }) {
  const isLegend =
    sticker.isLegend === true ||
    sticker.rarity === "legend" ||
    sticker.rarity === "legendary";

  /* const rarityLabel = isLegend ? "Leyenda" : "Común"; */

  const displayName =
    sticker.nickname ||
    sticker.fullName ||
    sticker.employeeName ||
    "Usuario";

  const imageUrl = getUserImageUrl(sticker.photoUrl, sticker.avatarUrl);

  return (
    <article className={`opened-sticker opened-sticker--${sticker.rarity}`}>
      <span>#{sticker.number}</span>

      <div className="opened-sticker__image">
        <img src={imageUrl} alt={displayName} />
      </div>

      <div>
        <strong>{displayName}</strong>
        <p>{sticker.department || sticker.area || "Sin área"}</p>
      </div>

      {isLegend && <small className="opened-sticker__legend">Legendaria</small>}
    </article>
  );
}