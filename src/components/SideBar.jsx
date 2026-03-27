import { NavLink } from "react-router-dom";
import "./SideBar.css";

function SideBar({ credencial, basePath = "" }) {
  const rutas = {
    admin: basePath ? `${basePath}/docentes` : "/Docentes",
    alumnos: basePath ? `${basePath}/alumnos` : "/Alumnos",
    grupos: basePath ? `${basePath}/grupos` : "/Grupos",
    ejercicios: basePath ? `${basePath}/ejercicios` : "/Ejercicios",
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-badge">🌟</div>
        <div>
          <h2 className="sidebar-title">Menú</h2>
          <p className="sidebar-subtitle">Aprender y organizar</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {credencial === "admin" && (
          <NavLink
            to={rutas.admin}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Docentes
          </NavLink>
        )}

        {credencial === "docente" && (
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
          </>
        )}
      </nav>
    </aside>
  );
}

export default SideBar;
