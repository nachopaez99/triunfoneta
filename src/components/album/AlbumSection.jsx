import { StickerCard } from "../sticker/StickerCard";

export function AlbumSection({ 
  department, stickers }) {
  const pastedCount = stickers.filter((sticker) => sticker.isPasted).length;

  return (
    <section className="album-section">
      <div className="album-section__header">
        <div>
          <h3>{department}</h3>
          <p>
            {pastedCount} de {stickers.length} figuritas pegadas
          </p>
        </div>
      </div>

      <div className="album-section__grid">
        {stickers.map((sticker) => (
          <StickerCard key={sticker.id} sticker={sticker} />
        ))}
      </div>
    </section>
  );
}