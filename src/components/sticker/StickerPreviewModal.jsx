import { PersonalStickerCard } from "./PersonalStickerCard";

export function StickerPreviewModal({ sticker, onClose }) {
  if (!sticker) return null;

  return (
    <div className="sticker-modal-backdrop" onClick={onClose}>
      <div
        className="sticker-modal-content"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="sticker-modal-close"
          type="button"
          onClick={onClose}
        >
          ×
        </button>

        <PersonalStickerCard
          sticker={sticker}
          fallbackName={sticker.nickname || sticker.employeeName || "Figurita"}
        />
      </div>
    </div>
  );
}