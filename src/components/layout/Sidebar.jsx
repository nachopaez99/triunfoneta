import { NavLink } from "react-router-dom";
import logo from "../../assets/logo-blanco-bandera.png";

const menuItems = [
  { path: "/", label: "Inicio🏠" },
  { path: "/album", label: "Álbum📕" },
  { path: "/trivias", label: "Trivias🧠" },
  { path: "/prode", label: "Prode🏆" },
  { path: "/intercambio", label: "Intercambio🤝" },
  { path: "/perfil", label: "Perfil👤" },
  { path: "/info", label: "¿Cómo juego? ❓" },

  
];

export function Sidebar() {
  return (
    <aside className="sidebar">
    
      <div className="sidebar-logo">
          <div className="logo-wrapper">
            <img src={logo} alt="logo de triunfo" className="logo-image" />
          </div>
          
          <h1>Menú</h1>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}