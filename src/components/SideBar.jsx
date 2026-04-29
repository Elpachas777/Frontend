import { NavLink } from "react-router-dom";
import "./SideBar.css";

function SideBar({ credencial, basePath = "", onCerrarSesion, usuario }) {
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
          <p className="sidebar-subtitle">{usuario?.nombre || "Usuario"}</p>
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
              to="/Canvas"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Ejercicio
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

      {onCerrarSesion && (
        <div className="sidebar-logout">
          <button className="sidebar-logout-btn" onClick={onCerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      )}
    </aside>
  );
}

export default SideBar;
