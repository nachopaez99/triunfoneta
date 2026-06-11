import { useState } from "react";
import { StickerPreviewModal } from "../sticker/StickerPreviewModal";

export function StickerStock({ stickers }) {
  const [selectedSticker, setSelectedSticker] = useState(null);

  const repeatedStickers = stickers.filter((sticker) => sticker.quantity > 1);

  return (
    <aside className="stock-panel">
      <h3>
        Mi <i>mazo</i>
      </h3>

      <div className="stock-group">
        <h4>Repetidas</h4>

        {repeatedStickers.length === 0 ? (
          <p className="empty-text">No tenés repetidas.</p>
        ) : (
          repeatedStickers.map((sticker) => (
            <div
              className="stock-item"
              key={sticker.id}
              onClick={() => setSelectedSticker(sticker)}
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