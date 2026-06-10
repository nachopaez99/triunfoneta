import { useState } from "react";
import { StickerPreviewModal } from "../sticker/StickerPreviewModal";

export function StickerStock({ stickers, onPasteSticker }) {
  const [selectedSticker, setSelectedSticker] = useState(null);

  const newStickers = stickers.filter(
    (sticker) => sticker.isOwned && !sticker.isPasted
  );

  const repeatedStickers = stickers.filter((sticker) => sticker.quantity > 1);

  function openSticker(sticker) {
    setSelectedSticker(sticker);
  }

  return (
    <aside className="stock-panel">
      <h3>
        Mi <i>mazo</i>
      </h3>

      <div className="stock-group">
        <h4>Nuevas</h4>

        {newStickers.length === 0 ? (
          <p className="empty-text">No tenés figuritas nuevas.</p>
        ) : (
          newStickers.map((sticker) => (
            <div
              className="stock-item"
              key={sticker.id}
              onClick={() => openSticker(sticker)}
            >
              <div>
                <span>
                  #{sticker.number} {sticker.employeeName}
                </span>
                <small>{sticker.department}</small>
              </div>

              <button
                className="stock-action"
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onPasteSticker(sticker.id);
                }}
              >
                Pegar
              </button>
            </div>
          ))
        )}
      </div>

      <div className="stock-group">
        <h4>Repetidas</h4>

        {repeatedStickers.length === 0 ? (
          <p className="empty-text">No tenés repetidas.</p>
        ) : (
          repeatedStickers.map((sticker) => (
            <div
              className="stock-item"
              key={sticker.id}
              onClick={() => openSticker(sticker)}
            >
              <div>
                <span>
                  #{sticker.number} {sticker.employeeName}
                </span>
                <small>{sticker.department}</small>
              </div>

              <strong>x{sticker.quantity}</strong>
            </div>
          ))
        )}
      </div>

      <StickerPreviewModal
        sticker={selectedSticker}
        onClose={() => setSelectedSticker(null)}
      />
    </aside>
  );
}