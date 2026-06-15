import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PersonalStickerCard } from "../components/sticker/PersonalStickerCard";
import {
  createMySticker,
  getUserImageUrl,
  updateMySticker,
  uploadMyStickerPhoto,
} from "../services/userService";
import { changePassword } from "../services/authService";

export function ProfilePage() {
  const { user, mySticker, logout, refreshMySticker } = useAuth();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState("");
  const [phrase, setPhrase] = useState("");
  const [nickname, setNickname] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (!user) return;

    setPreviewImage(getUserImageUrl(mySticker?.photoUrl, user?.avatarUrl));
    setPhrase(mySticker?.funFact || "");
    setNickname(mySticker?.nickname || user.fullName || "");
  }, [user, mySticker]);

  if (!user) {
    return (
      <section className="profile-page">
        <p>Cargando perfil...</p>
      </section>
    );
  }

  const fullName = user.fullName || "Usuario";
  const areaName = user.area?.name || "Sin área";
/*   const hasPhoto = Boolean(mySticker?.photoUrl); */

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
    const cleanNickname = nickname.trim() || fullName;

    if (!selectedFile && !mySticker) {
      alert("Debés cargar una foto para crear tu figurita.");
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        nickname: cleanNickname.slice(0, 30),
        funFact: phrase || "",
        useAvatar: false,
        yearsInCompany: mySticker?.yearsInCompany || 0,
        position: mySticker?.position || "Empleado Triunfo",
      };

      if (!mySticker) {
        await createMySticker(payload);
      } else {
        await updateMySticker(payload);
      }

      if (selectedFile) {
        await uploadMyStickerPhoto(selectedFile);
      }

      const updatedSticker = await refreshMySticker();

      setNickname(updatedSticker?.nickname || fullName);
      setPreviewImage(getUserImageUrl(updatedSticker?.photoUrl, user?.avatarUrl));
      setPhrase(updatedSticker?.funFact || phrase);
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
      await changePassword({ currentPassword, newPassword });

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
            <label>Apodo para tu figurita</label>
            <input
              value={nickname}
              onChange={(event) => setNickname(event.target.value)}
              placeholder="Elegí tu apodo"
              maxLength={30}
            />
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
            <input
  type="file"
  accept="image/*"
  onChange={handleImageChange}
  /* disabled={hasPhoto} */
/>

{/* {hasPhoto && (
  <p className="empty-text">
    Ya cargaste tu foto de figurita. No puede modificarse.
  </p>
)} */}
          </div>

          <div className="profile-actions">
  <button
    className="primary-button"
    type="button"
    onClick={handleSubmitSticker}
/*     disabled={isSaving || hasPhoto} */
  >
    {isSaving ? "Guardando..." : "Guardar figurita"}
    
  </button>

  
</div>
        </form>

        <aside className="personal-sticker-preview">
          <span>Vista previa</span>

          <PersonalStickerCard
            sticker={{
              nickname: nickname.trim() || fullName,
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
        <button
    className="profile-password-button"
    type="button"
    onClick={() => setIsPasswordModalOpen(true)}
  >
    Cambiar contraseña
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