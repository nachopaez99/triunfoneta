import { PersonalStickerCard } from "./PersonalStickerCard";

export function StickerPreviewModal({ sticker, onClose }) {
  if (!sticker) return null;

  const normalizedSticker = {
    ...sticker,
    photoUrl: sticker.photoUrl || sticker.imageUrl || sticker.avatarUrl || "",
    nickname: sticker.nickname || sticker.employeeName || "Figurita",
    area: sticker.area || sticker.department || "Sin área",
    position: sticker.position || "Figurita",
  };

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
          sticker={normalizedSticker}
          fallbackName={normalizedSticker.nickname}
        />
      </div>
    </div>
  );
}