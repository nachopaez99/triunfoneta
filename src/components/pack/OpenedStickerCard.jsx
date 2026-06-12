export function OpenedStickerCard({ sticker }) {
  const rarityLabel =
    sticker.rarity === "legendary" ? "Legendaria" : "Común";

  const displayName =
    sticker.nickname ||
    sticker.fullName ||
    sticker.employeeName ||
    "Usuario";

  return (
    <article className={`opened-sticker opened-sticker--${sticker.rarity}`}>
      <span>#{sticker.number}</span>

      <div>
        <strong>{displayName}</strong>
        <p>{sticker.department || sticker.area}</p>
      </div>

      <small>{rarityLabel}</small>
    </article>
  );
}