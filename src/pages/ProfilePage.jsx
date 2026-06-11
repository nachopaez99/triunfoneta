import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PersonalStickerCard } from "../components/sticker/PersonalStickerCard";
import {
  createMySticker,
  getBackendFileUrl,
  getMySticker,
  uploadMyStickerPhoto,
} from "../services/userService";
import { changePassword } from "../services/authService";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [mySticker, setMySticker] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [phrase, setPhrase] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    async function loadSticker() {
      if (!user) return;

      try {
        const sticker = await getMySticker();

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

  async function handleChangePassword(event) {
    event.preventDefault();

    if (!currentPassword || !newPassword || !repeatPassword) {
      alert("Completá todos los campos.");
      return;
    }

    if (newPassword !== repeatPassword) {
      alert("Las contraseñas nuevas no coinciden.");
      return;
    }

    if (newPassword.length < 6) {
      alert("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsChangingPassword(true);

    try {
      await changePassword({
        currentPassword,
        newPassword,
      });

      alert("Contraseña actualizada correctamente.");

      setCurrentPassword("");
      setNewPassword("");
      setRepeatPassword("");
      setIsPasswordModalOpen(false);
    } catch (error) {
      console.error("Error cambiando contraseña:", error);
      alert(error.message || "No se pudo cambiar la contraseña.");
    } finally {
      setIsChangingPassword(false);
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

          <button
            className="secondary-button"
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            Cambiar contraseña
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

      {isPasswordModalOpen && (
        <div
          className="password-modal-backdrop"
          onClick={() => setIsPasswordModalOpen(false)}
        >
          <form
            className="password-modal"
            onSubmit={handleChangePassword}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="password-modal__close"
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
            >
              ×
            </button>

            <h3>Cambiar contraseña</h3>

            <div className="form-group">
              <label>Contraseña actual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                autoComplete="current-password"
              />
            </div>

            <div className="form-group">
              <label>Nueva contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="form-group">
              <label>Repetir nueva contraseña</label>
              <input
                type="password"
                value={repeatPassword}
                onChange={(event) => setRepeatPassword(event.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button
              className="primary-button"
              type="submit"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? "Guardando..." : "Guardar contraseña"}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}