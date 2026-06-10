export function OpenedStickerCard({ sticker }) {
  const rarityLabel = sticker.rarity === "legendary" ? "Legendaria" : "Común";

  return (
    <article className={`opened-sticker opened-sticker--${sticker.rarity}`}>
      <span>#{sticker.number}</span>

      <div>
        <strong>{sticker.employeeName}</strong>
        <p>{sticker.department}</p>
      </div>

      <small>{rarityLabel}</small>
    </article>
  );
}