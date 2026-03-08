import { NavLink } from "react-router-dom";
import "./SideBar.css";
function SideBar({ credencial }) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Menú</h2>
      <nav className="sidebar-nav">
        {credencial === "admin" && (
          <>
            <NavLink
              to="/Docentes"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Profesores
            </NavLink>
          </>
        )}
        {credencial === "docente" && (
          <>
            <NavLink
              to="/Alumnos"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Alumnos
            </NavLink>
            <NavLink
              to="/Grupos"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Grupos
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
}

export default SideBar;
