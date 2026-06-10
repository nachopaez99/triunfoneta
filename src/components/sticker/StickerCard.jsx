export function StickerCard({ sticker }) {
  const isPasted = sticker.isPasted;
const isHidden = !sticker.isPasted;
const isLegendary = sticker.rarity === "legendary";

  return (
    <article
     className={[
  "sticker-card",
  isHidden ? "sticker-card--hidden" : "",
  isPasted ? "sticker-card--pasted" : "",
  isPasted && isLegendary ? "sticker-card--legendary" : "",
]
  .filter(Boolean)
  .join(" ")}
    >
      <div className="sticker-card__top">
        <span>#{sticker.number}</span>
        {/* <strong>{isLegendary ? "LEG" : "COM"}</strong>  <---- Muestra la figurita si es legendaria aunque no este pegada*/}
        <strong>{isPasted ? (isLegendary ? "LEGENDARIA" : "COMUN") : "???"}</strong>
      </div>

      <div className="sticker-card__photo">
  {isPasted && sticker.imageUrl ? (
    <img src={sticker.imageUrl} alt={sticker.employeeName} />
  ) : (
    <div className="sticker-card__placeholder">?</div>
  )}
</div>

      <div className="sticker-card__info">
  <h4>{isPasted ? sticker.employeeName : "Figurita oculta"}</h4>

  {isPasted ? (
    <>
      <p>{sticker.position}</p>
      <span>{sticker.department}</span>
    </>
  ) : (
    <>
      <p>Completá el álbum para revelarla</p>
      <span>Sin pegar</span>
    </>
  )}
</div>

      <div className="sticker-card__bottom">
  {isPasted ? "Pegada" : "Pendiente"}
</div>
    </article>
  );
}