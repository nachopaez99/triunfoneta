import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  getBackendFileUrl,
  getMySticker,
} from "../../services/userService";

export function Header() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    async function loadHeaderAvatar() {
      if (!user) return;

      try {
        const sticker = await getMySticker();

        setAvatarUrl(
          getBackendFileUrl(sticker?.photoUrl) ||
            getBackendFileUrl(user?.avatarUrl) ||
            ""
        );
      } catch {
        setAvatarUrl(getBackendFileUrl(user?.avatarUrl) || "");
      }
    }

    loadHeaderAvatar();
  }, [user]);

  if (!user) return null;

  return (
    <header className="header">
      <div>
        <h1>
          <i>Triunfoneta</i>⚽
        </h1>
        <p>Completá tu álbum, ganá puntos e intercambiá figuritas.</p>
      </div>

      <div className="header-user">
        <span className="points-pill">{user.points} pts</span>

        <div
          className="avatar"
          onClick={() => navigate("/perfil")}
          title="Mi perfil"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={user.fullName || "Perfil"} />
          ) : (
            <span>{user.fullName?.charAt(0) || "?"}</span>
          )}
        </div>
      </div>
    </header>
  );
}