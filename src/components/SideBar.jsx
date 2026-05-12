import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./SideBar.css";

function SideBar({ credencial, basePath = "", onCerrarSesion, usuario }) {
  const [showMenu, setShowMenu] = useState(false);
  const rutas = {
    admin: basePath ? `${basePath}/docentes` : "/admin/docentes",
    adminEscuelas: basePath ? `${basePath}/escuelas` : "/admin/escuelas",
    alumnos: basePath ? `${basePath}/alumnos` : "/Alumnos",
    grupos: basePath ? `${basePath}/grupos` : "/Grupos",
    ejercicios: basePath ? `${basePath}/ejercicios` : "/Ejercicios",
    asignar: basePath ? `${basePath}/asignar` : "/Asignar",
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src="/img/logo.png" alt="Logo" className="sidebar-brand-logo" />
        <div>
          <h2 className="sidebar-title">Menú</h2>
          <p className="sidebar-subtitle">Usuario</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {credencial === "admin" && (
          <>
            <NavLink
              to={rutas.admin}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Docentes
            </NavLink>
            <NavLink
              to={rutas.adminEscuelas}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Escuelas
            </NavLink>
          </>
        )}

        {(credencial === "docente" || credencial === "director") && (
          <>
            <NavLink
              to={rutas.alumnos}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Alumnos
            </NavLink>

            <NavLink
              to={rutas.grupos}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Grupos
            </NavLink>

            <NavLink
              to={rutas.ejercicios}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Ejercicios
            </NavLink>

            <NavLink
              to={rutas.asignar}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Asignar
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-user-panel">
        <button
          className="sidebar-user-button"
          onClick={() => setShowMenu((v) => !v)}
        >
          <div className="sidebar-user-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
          </div>
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{usuario || "Usuario"}</span>
            <span className="sidebar-user-role">
              {credencial === "docente" ? "Docente" : credencial === "admin" ? "Admin" : credencial === "director" ? "Director" : credencial}
            </span>
          </div>
          <span className="sidebar-user-caret">{showMenu ? "▲" : "▼"}</span>
        </button>

        {showMenu && onCerrarSesion && (
          <div className="sidebar-user-menu">
            <button className="sidebar-user-menu-logout" onClick={onCerrarSesion}>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

export default SideBar;
