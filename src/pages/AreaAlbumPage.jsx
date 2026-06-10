import { useParams, Link } from "react-router-dom";

import { useAlbum } from "../context/AlbumContext";
import { StickerCard } from "../components/sticker/StickerCard";
import { StickerStock } from "../components/stock/StickerStock";

export function AreaAlbumPage() {
  const { area } = useParams();
  const { stickers, pasteSticker } = useAlbum();

  const areaStickers = stickers.filter(
    (sticker) => sticker.department.toLowerCase() === area.toLowerCase()
  );

  return (
    <section className="album-page">
      <div className="album-main">
        <header className="page-header">
          <div>
            <h2>{area}</h2>
            <p>Figuritas correspondientes a esta área.</p>
          </div>

          <Link to="/album" className="secondary-button">
            Volver al álbum
          </Link>
        </header>

        <section className="album-section">
          <div className="album-section__grid">
            {areaStickers.map((sticker) => (
              <StickerCard key={sticker.id} sticker={sticker} />
            ))}
          </div>
        </section>
      </div>

      <StickerStock stickers={stickers} onPasteSticker={pasteSticker} />
    </section>
  );
}