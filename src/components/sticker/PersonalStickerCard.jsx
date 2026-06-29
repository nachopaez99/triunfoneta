import { getUserImageUrl } from "../../services/userService";

export function PersonalStickerCard({ sticker, fallbackName }) {
  const displayName =
    sticker?.nickname ||
    sticker?.fullName ||
    sticker?.user?.fullName ||
    sticker?.employeeName ||
    fallbackName ||
    "Usuario";

const isLegend =
  sticker?.isLegend === true ||
  sticker?.rarity === "legend";

  const imageUrl = getUserImageUrl(
    sticker?.photoUrl || sticker?.imageUrl,
    sticker?.avatarUrl
  );
/* console.log("lenght", displayName.length
); */
/* "opened-sticker__name-" */

  return (
    <div className="personal-sticker-card">
      <div className="personal-sticker-image">
        <img src={imageUrl} alt={displayName} />
      </div>

      <h3 className={displayName.length > 20? "opened-sticker__name-" : "opened-sticker__name-max" }>{displayName}</h3>

      {isLegend && <div className="sticker-legend">Legendaria</div>}

      <strong>{sticker?.area || "Sin área"}</strong>

      {sticker?.funFact && <blockquote>{sticker.funFact}</blockquote>}
    </div>
  );
}
