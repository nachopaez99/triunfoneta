import { useState } from "react";
import { useAlbum } from "../context/AlbumContext";
import { useAuth } from "../context/AuthContext";
import { PackOpeningModal } from "../components/pack/PackOpeningModal";
import sobre from "../assets/sobre.png";


export function HomePage() {
  const [isPackModalOpen, setIsPackModalOpen] = useState(false);


const semaforo = {
  red: 33,
  yellow: 66,
  green: 100
};
  const { user, refreshUser } = useAuth();

const {
  progress,
  pastedStickers,
  totalStickers,
  newStickers,
  repeatedStickers,
  packCost,
  stickersPerPack,
  lastOpenedPack,
  openPack,
  isOpeningPack,
} = useAlbum();

 async function handleOpenPack() {
  const openedPack = await openPack();

  if (!openedPack) {
    return;
  }

  await refreshUser();

  setIsPackModalOpen(true);
}
  /* console.log("Progreso del álbum:", progress); */

function getProgressColor() {
  let variable = ""
   progress <= semaforo.red 
    ? variable ="progressRed" 
    : progress <= semaforo.yellow
    ? variable ="progressYellow" : variable ="progressGreen"
    return variable 
}
/* console.log(getProgressColor()); */
  return (
    <section className="dashboard-page">
      <header className="dashboard-hero">
        <div>
          <span>Bienvenido/a</span>
          <h2>
            {user?.fullName}
          </h2>
          <p>Ganá puntos, comprá sobres y completá tu álbum corporativo.</p>
        </div>

        <div className="dashboard-points">
          <strong>{user?.points ?? 0}</strong>
          <span>puntos disponibles</span>
        </div>
      </header>

      <div className="dashboard-grid">
        <article className="dashboard-card">
          <span>Progreso del álbum</span>
          <strong 
          className={getProgressColor()}
          >{progress}%</strong>
          <p>
            {pastedStickers} de {totalStickers} figuritas pegadas
          </p>
        </article>

        <article className="dashboard-card">
          <span>Figuritas nuevas</span>
          <strong>{newStickers.length}</strong>
          <p>Disponibles para pegar</p>
        </article>

        <article className="dashboard-card">
          <span>Repetidas</span>
          <strong>{repeatedStickers.length}</strong>
          <p>Disponibles para intercambio</p>
        </article>
      </div>

      <section className="pack-section">
        <div>
          <h3>Comprar sobre</h3>
          <p>Cada sobre contiene figuritas aleatorias para completar tu álbum.</p>
        </div>

        <div className="pack-card">
          
           <div className="pack-image-wrapper">
           <img style={{  height: "100px" }} src={sobre} alt="sobre de figuritas" />
           </div>

           
          
          <h4>Sobre clásico</h4>
          <p>Incluye {stickersPerPack} figuritas</p>
          <strong>{packCost} pts</strong>

          {/* <button
              className="primary-button"
              type="button"
              onClick={handleOpenPack}
              disabled={isOpeningPack}
            >
              {isOpeningPack ? "Abriendo..." : "Comprar sobre"}
          </button> */}
          <button
  className="primary-button"
  disabled
  title="Funcionalidad temporalmente deshabilitada"
>
  Comprar sobre (próximamente)
</button>
          
        </div>
        {/* <button
  className="secondary-button"
  type="button"
  onClick={testBackendConnection}
>
  prueba del back
</button> */}
      </section>

      {lastOpenedPack.length > 0 && (
        <section className="last-pack-section">
          <h3>Último sobre abierto</h3>

          <div className="last-pack-grid">
            {lastOpenedPack.map((sticker, index) => (
              <article
                className={`opened-sticker opened-sticker--${sticker.rarity}`}
                key={`${sticker.id}-${index}`}
              >
                <span>#{sticker.number}</span>
                <strong>{sticker.employeeName}</strong>
                <small>
                  {sticker.rarity === "legendary" ? "Legendaria" : "Común"}
                </small>
              </article>
            ))}
          </div>
        </section>
      )}

      {isPackModalOpen && (
        <PackOpeningModal
          stickers={lastOpenedPack}
          onClose={() => setIsPackModalOpen(false)}
        />
      )}
    </section>
  );
}