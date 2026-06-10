import { useState } from "react";
import { OpenedStickerCard } from "./OpenedStickerCard";

export function PackOpeningModal({ stickers, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!stickers || stickers.length === 0) return null;

  const isLastSticker = currentIndex === stickers.length - 1;

  function handleCardClick() {
    if (isLastSticker) {
      return;
    }

    setCurrentIndex((current) => current + 1);
  }

  return (
    <div className="modal-overlay">
      <section className="pack-modal pack-modal--stack">
        <header className="pack-modal__header">
          <div>
            <h2>¡Sobre abierto!</h2>
            <p>
              Tocá la carta para avanzar · {currentIndex + 1}/{stickers.length}
            </p>
          </div>

          <button className="modal-close" type="button" onClick={onClose}>
            ×
          </button>
        </header>

        <button
          className="pack-stack"
          type="button"
          onClick={handleCardClick}
          disabled={isLastSticker}
        >
          {stickers.map((sticker, index) => {
            if (index < currentIndex) return null;

            const offset = index - currentIndex;

            return (
              <div
                className="pack-stack__card"
                key={`${sticker.id}-${index}`}
                style={{
                  zIndex: stickers.length - index,
                  transform: `translate(${offset * 10}px, ${
                    offset * 8
                  }px) rotate(${offset * 3}deg)`,
                }}
              >
                <OpenedStickerCard sticker={sticker} />
              </div>
            );
          })}
        </button>

        {isLastSticker && (
          <button className="primary-button" type="button" onClick={onClose}>
            Continuar
          </button>
        )}
      </section>
    </div>
  );
}