import { useState } from "react";
import { useAlbum } from "../context/AlbumContext";
import { useNavigate } from "react-router-dom";
import { PersonalStickerCard } from "../components/sticker/PersonalStickerCard";
import { useAuth } from "../context/AuthContext";

export function ProfilePage() {
  const { user, setUser } = useAlbum();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [previewImage, setPreviewImage] = useState(
    user.personalSticker.photoUrl
  );
  const [phrase, setPhrase] = useState(user.personalSticker.phrase || "");

  const isLocked = user.personalSticker.status !== "pending";

/* function handleLogout() {
  logout();
  navigate("/login", { replace: true });
} */


  function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setPreviewImage(imageUrl);
  }

  function handleSubmitSticker() {
    if (!previewImage) {
      alert("Debés cargar una foto para crear tu figurita.");
      return;
    }

    setUser((currentUser) => ({
      ...currentUser,
      personalSticker: {
        ...currentUser.personalSticker,
        photoUrl: previewImage,
        phrase,
        status: "review",
      },
    }));
  }


function handleLogout() {
  logout();
  /* console.log(localStorage.getItem("accessToken")); */
  navigate("/login", { replace: true });
}

  return (
    <section className="profile-page">
      <header className="page-header">
        <div>
          <h2>Mi perfil</h2>
          <p>Completá tus datos y creá tu figurita personal.</p>
        </div>
      </header>

      <div className="profile-layout">
        <form className="profile-form">
          <div className="form-group">
            <label>Nombre</label>
            <input value={user.firstName} disabled />
          </div>

          <div className="form-group">
            <label>Apellido</label>
            <input value={user.lastName} disabled />
          </div>

          <div className="form-group">
            <label>Área</label>
            <input value={user.department} disabled />
          </div>

          <div className="form-group">
            <label>Puesto</label>
            <input value={user.position} disabled />
          </div>

          <div className="form-group">
            <label>Frase para tu figurita</label>
            <textarea
              disabled={isLocked}
              value={phrase}
              onChange={(event) => setPhrase(event.target.value)}
              placeholder="Escribí una frase breve"
            />
          </div>

          <div className="form-group">
            <label>Foto de figurita</label>
            <input
              type="file"
              accept="image/*"
              disabled={isLocked}
              onChange={handleImageChange}
            />
          </div>

          {user.personalSticker.status === "pending" && (
            <button
              className="primary-button"
              type="button"
              onClick={handleSubmitSticker}
            >
              Enviar figurita para aprobación
            </button>
          )}

          {user.personalSticker.status === "review" && (
            <p className="profile-status profile-status--review">
              Tu figurita está pendiente de aprobación.
            </p>
          )}

          {user.personalSticker.status === "approved" && (
            <p className="profile-status profile-status--approved">
              Tu figurita ya fue aprobada y no puede modificarse.
            </p>
          )}
        </form>

        <aside className="personal-sticker-preview">
          <span>Vista previa</span>
              <PersonalStickerCard
                  sticker={{
                    nickname: `${user.firstName} ${user.lastName}`,
                    position: user.position,
                    area: user.department,
                    photoUrl: previewImage,
                    funFact: phrase,
                  }}
                  fallbackName={`${user.firstName} ${user.lastName}`}s
              />
          {/* <div className="personal-sticker-card">
            <div className="personal-sticker-image">
              {previewImage ? <img src={previewImage} alt="Preview" /> : "?"}
            </div>

            <h3>
              {user.firstName} {user.lastName}
            </h3>

            <p>{user.position}</p>
            <strong>{user.department}</strong>

            {phrase && <blockquote>{phrase}</blockquote>}
          </div> */}
          
        </aside>
        <button /* type="button" */ className="btn-salir" onClick={handleLogout}>
          Salir
        </button>
      </div>
    </section>
  );
}