import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PersonalStickerCard } from "../components/sticker/PersonalStickerCard";
import {
  createMySticker,
  getMySticker,
  uploadMyStickerPhoto,
  getBackendFileUrl,
} from "../services/userService";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mySticker, setMySticker] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [phrase, setPhrase] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadSticker() {
      if (!user) return;

      try {
        const sticker = await getMySticker();
console.log("Sticker cargado desde backend:", sticker);
        setMySticker(sticker);
        setPreviewImage(getBackendFileUrl(sticker.photoUrl) || user.avatarUrl || "");
        setPhrase(sticker.funFact || "");
      } catch (error) {
        console.error("Error cargando figurita:", error);
        setMySticker(null);
        setPreviewImage(user.avatarUrl || "");
        setPhrase("");
      }
    }

    loadSticker();
  }, [user]);

  if (!user) {
    return (
      <section className="profile-page">
        <p>Cargando perfil...</p>
      </section>
    );
  }

  const fullName = user.fullName || "Usuario";
  const areaName = user.area?.name || "Sin área";

  function handleImageChange(event) {
  const file = event.target.files[0];

  if (!file) return;

  if (previewImage?.startsWith("blob:")) {
    URL.revokeObjectURL(previewImage);
  }

  setSelectedFile(file);
  setPreviewImage(URL.createObjectURL(file));
}
useEffect(() => {
  return () => {
    if (previewImage?.startsWith("blob:")) {
      URL.revokeObjectURL(previewImage);
    }
  };
}, [previewImage]);

  async function handleSubmitSticker() {
    if (!selectedFile && !mySticker) {
      alert("Debés cargar una foto para crear tu figurita.");
      return;
    }

    setIsSaving(true);

    try {
      if (!mySticker) {
        await createMySticker({
          nickname: fullName.slice(0, 30),
          funFact: phrase || "",
          useAvatar: false,
        });
      }

      if (selectedFile) {
        await uploadMyStickerPhoto(selectedFile);
      }

      const updatedSticker = await getMySticker();

      setMySticker(updatedSticker);
      setPreviewImage(getBackendFileUrl(updatedSticker.photoUrl) || user.avatarUrl || "");
      setPhrase(updatedSticker.funFact || phrase);
      setSelectedFile(null);

      alert("Figurita guardada correctamente.");
    } catch (error) {
      console.error("Error guardando figurita:", error);
      alert(error.message || "No se pudo guardar la figurita.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <section className="profile-page">
      <header className="page-header">
        <div>
          <h2>Mi perfil</h2>
          <p>Completá tus datos y actualizá tu figurita personal.</p>
        </div>
      </header>

      <div className="profile-layout">
        <form className="profile-form">
          <div className="form-group">
            <label>Nombre</label>
            <input value={fullName} disabled />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input value={user.email || ""} disabled />
          </div>

          <div className="form-group">
            <label>Área</label>
            <input value={areaName} disabled />
          </div>

          <div className="form-group">
            <label>Frase para tu figurita</label>
            <textarea
              value={phrase}
              onChange={(event) => setPhrase(event.target.value)}
              placeholder="Escribí una frase breve"
            />
          </div>

          <div className="form-group">
            <label>Foto de figurita</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={handleSubmitSticker}
            disabled={isSaving}
          >
            {isSaving ? "Guardando..." : "Guardar figurita"}
          </button>
        </form>

        <aside className="personal-sticker-preview">
          <span>Vista previa</span>

          <PersonalStickerCard
            sticker={{
              nickname: mySticker?.nickname || fullName,
              position: mySticker?.position || "Empleado Triunfo",
              area: mySticker?.area || areaName,
              photoUrl: previewImage,
              funFact: phrase,
            }}
            fallbackName={fullName}
          />
        </aside>

        <button className="btn-salir" type="button" onClick={handleLogout}>
          Salir
        </button>
      </div>
    </section>
  );
}