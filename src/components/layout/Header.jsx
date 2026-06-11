import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";


export function Header() {
  const { user } = useAuth();
  /* console.log("Usuario en Header:", user.avatarUrl); */
  const navigate = useNavigate();
  return (
    <header className="header">
      <div>
        <h1><i>Triunfoneta</i>⚽</h1>
        <p>Completá tu álbum, ganá puntos e intercambiá figuritas.</p>
      </div>

      <div className="header-user">
        <span className="points-pill">{user.points} pts</span>
        <div
  className="avatar"
  onClick={() => navigate("/perfil")}
  title="Mi perfil"
>
  <img src={user.avatarUrl} alt={user.fullName} />
</div>
      </div>
    </header>
  );
}