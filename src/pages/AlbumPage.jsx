import { useEffect, useState } from "react";
import { useAlbum } from "../context/AlbumContext";
import { StickerStock } from "../components/stock/StickerStock";
import { StickerPreviewModal } from "../components/sticker/StickerPreviewModal";
import { getUserImageUrl } from "../services/userService";
import { getAlbumSections } from "../services/packService";


const AREAS_PER_PAGE = 5;




function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function normalizeColor(color) {
  if (!color) return "#007A53";

  const cleanColor = color.trim();
  const colorWithHash = cleanColor.startsWith("#")
    ? cleanColor
    : `#${cleanColor}`;

  const isValidHex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(
    colorWithHash
  );

  if (!isValidHex) {
    return "#007A53";
  }

  return colorWithHash;
}

export function AlbumPage() {
  const { albumProgress, collection, pasteSticker, backendAreas } = useAlbum();
  const [selectedSticker, setSelectedSticker] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [albumSections, setAlbumSections] = useState([]);

useEffect(() => {
  async function loadAlbumSections() {
    try {
      const sections = await getAlbumSections();
      setAlbumSections(Array.isArray(sections) ? sections : []);
    } catch (error) {
      console.error("Error cargando secciones del álbum:", error);
    }
  }

  loadAlbumSections();
}, []);

  const normalizedAlbumProgress = Object.values(
  albumProgress.reduce((acc, area) => {
    const areaName = String(area.area || "").trim().replace(/\s+/g, " ");

    if (!acc[areaName]) {
      acc[areaName] = {
        ...area,
        area: areaName,
      };
      return acc;
    }

    acc[areaName] = {
      ...acc[areaName],
      totalStickers: Math.max(
        Number(acc[areaName].totalStickers || 0),
        Number(area.totalStickers || 0)
      ),
      ownedStickers: Math.max(
        Number(acc[areaName].ownedStickers || 0),
        Number(area.ownedStickers || 0)
      ),
      percentage: Math.max(
        Number(acc[areaName].percentage || 0),
        Number(area.percentage || 0)
      ),
      isComplete: acc[areaName].isComplete || area.isComplete,
    };

    return acc;
  }, {})
);

const totalPages = Math.ceil(normalizedAlbumProgress.length / AREAS_PER_PAGE);
const hasAlbumData = normalizedAlbumProgress.length > 0;
  const isCoverPage = currentPage === 0;





const visibleAreas = isCoverPage
  ? []
  : normalizedAlbumProgress.slice(
      (currentPage - 1) * AREAS_PER_PAGE,
      currentPage * AREAS_PER_PAGE
    );

  function goToPreviousPage() {
    setCurrentPage((page) => Math.max(page - 1, 0));
  }

  function goToNextPage() {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  }

  const stockStickers = collection.map((item) => ({
  id: item.sticker.id,

  // datos originales para el modal
  nickname: item.sticker.nickname,
  area: item.sticker.area,
  stickerNumber: item.sticker.stickerNumber,
  photoUrl: item.sticker.photoUrl,
  position: item.sticker.position,
  funFact: item.sticker.funFact,
  rarity: item.sticker.rarity,
isLegend: item.sticker.rarity === "legendary",

  // datos que ya usa el stock
  number: item.sticker.stickerNumber,
  employeeName: item.sticker.nickname,
  department: item.sticker.area,

  quantity: item.quantity,
  isOwned: item.quantity > 0,
  /* isPasted: item.quantity > 0, */
}));
if (!hasAlbumData) {
  return (
    <section className="album-page">
      <p>Cargando álbum...</p>
    </section>
  );
}

  return (
    <section className="album-page">
      <div className="album-main">
        <header className="page-header">
          <div>
            <h2>Mi álbum</h2>
            <p>Recorré las páginas del álbum y completá las áreas.</p>
          </div>
        </header>

        <section className="album-book-page">
          <div
            key={currentPage}
            className={`album-page-sheet ${
              isCoverPage ? "album-page-sheet--cover" : ""
            }`}
          >
            {isCoverPage ? (
              <div className="album-cover">
                <span>Álbum</span>
                <h3>Triunfoneta</h3>
                <p>
                  Completá las figuritas de todas las áreas y viví la pasión del
                  mundial.
                </p>
                <strong>Edición Mundial</strong>
              </div>
            ) : (
              <>
                <h3>Álbum</h3>

                <div className="album-area-grid">
                  {visibleAreas.map((area) => {
                    const backendArea = backendAreas.find(
  (item) => normalizeText(item.name) === normalizeText(area.area)
);

                    const color = normalizeColor(backendArea?.color);

                    const section = albumSections.find(
  (item) => normalizeText(item.area) === normalizeText(area.area)
);

const sectionStickers = section?.stickers || [];

const areaCollection = sectionStickers.length
  ? sectionStickers.map((sectionItem) => {
      if (!sectionItem.owned) {
        return null;
      }

      return (
        collection.find(
          (item) =>
            Number(item.sticker?.id) === Number(sectionItem.sticker?.id)
        ) || sectionItem
      );
    })
  : collection
      .filter(
        (item) =>
          normalizeText(item.sticker?.area) === normalizeText(area.area)
      )
      .sort(
        (a, b) =>
          Number(a.sticker?.stickerNumber || 0) -
          Number(b.sticker?.stickerNumber || 0)
      );

const totalSlots = sectionStickers.length || area.totalStickers;


                    return (
                      <article className="album-area-card" key={normalizeText(area.area)}>
                        <div
                          className="album-area-card__header"
                          style={{ backgroundColor: color }}
                        >
                          {area.area}
                        </div>

                        <div className="album-area-card__slots">
                          {Array.from({
                            length: totalSlots/* Math.min(area.totalStickers, 12) */,
                          }).map((_, index) => {
                            const ownedSticker = areaCollection[index];
                            const sticker = ownedSticker?.sticker;
                            const missingSticker = sectionStickers[index]?.sticker;

                            return (
                              <article
                                key={`${area.area}-${index}`}
                                className={
                                  ownedSticker
                                    ? "album-sticker album-sticker--pasted"
                                    : "album-sticker album-sticker--missing"
                                }
                                title={
                                  ownedSticker
                                    ? `#${sticker.stickerNumber} ${sticker.nickname}`
                                    : "Figurita pendiente"
                                }
                                onClick={() => ownedSticker && setSelectedSticker(sticker)}
                              >
                                <div className="album-sticker__inner">
                                  {ownedSticker ? (
                                    <>
                                      <div
                                        className="album-sticker__photo"
                                        style={{ borderColor: color }}
                                      >
                                        <img
                                          src={getUserImageUrl(sticker.photoUrl, sticker.avatarUrl)}
                                          alt={sticker.nickname || "Figurita"}
                                        />
                                      </div>

                                      <div className="album-sticker__info">
                                        <strong>{sticker.nickname}</strong>
                                        <small>#{sticker.stickerNumber}</small>
                                      </div>
                                    </>
                                  ) : (
                                    <>
                                      <div className="album-sticker__missing-photo">
                                        <span>?</span>
                                      </div>

                                      <div className="album-sticker__info">
                                        <strong>Falta</strong>
                                        <small>#{missingSticker?.stickerNumber || index + 1}</small>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </article>
                            );
                          })}
                        </div>

                        <p>
                          {area.ownedStickers}/{area.totalStickers} pegadas {/* ·{" "}
                          {area.percentage}% */}
                        </p>
                      </article>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          <div className="album-pagination">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
            >
              {"<"}
            </button>

            <span>
              {isCoverPage ? "Portada" : `${currentPage} / ${totalPages}`}
            </span>

            <button
              type="button"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              {">"}
            </button>
          </div>
        </section>
      </div>

      
    {/* <StickerStock stickers={stockStickers} onPasteSticker={pasteSticker} /> */}
    <StickerStock stickers={stockStickers} />
    <StickerPreviewModal
      sticker={selectedSticker}
      onClose={() => setSelectedSticker(null)}
    />
    </section>
  );
}