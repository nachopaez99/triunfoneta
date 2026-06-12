import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserImageUrl } from "../../services/userService";

export function Header() {
  const { user, mySticker } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const avatarUrl = getUserImageUrl(
    mySticker?.photoUrl,
    user?.avatarUrl
  );

  return (
    <header className="header">
      <div>
        <h1>
          <i>Triunfoneta</i>⚽
        </h1>

        <p>
          Completá tu álbum, ganá puntos e intercambiá figuritas.
        </p>
      </div>

      <div className="header-user">
        <span className="points-pill">
          {user.points} pts
        </span>

        <div
          className="avatar"
          onClick={() => navigate("/perfil")}
          title="Mi perfil"
        >
          <img
            src={avatarUrl}
            alt={user.fullName || "Perfil"}
          />
        </div>
      </div>
    </header>
  );
}