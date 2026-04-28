import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import Grupos from "../docente/Grupos";
import Docentes from "../admin/Docentes";
import Alumnos from "../docente/Alumnos";
import Ejercicios from "../docente/Ejercicios";
import { cerrarSesion } from "../api/sesion.api";
import useCredenciales from "../hooks/useCredenciales";

function Privado({ setAutentificado }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { credencial, usuario } = useCredenciales();

  const handleLogout = () => {
    cerrarSesion({ setAutentificado });
  };

  const displayName = usuario?.nombre || "Usuario";
  const roleLabel =
    credencial === "director"
      ? "Director"
      : credencial === "docente"
      ? "Docente"
      : credencial === "admin"
      ? "Admin"
      : "Usuario";

  return (
    <div className="private-layout">
      <SideBar credencial={credencial} />

      <div className="private-topbar">
        <div className="private-user-widget">
          <button
            type="button"
            className="private-user-toggle"
            onClick={() => setMenuAbierto((prev) => !prev)}
          >
            <div className="private-user-avatar">
              {usuario?.foto ? (
                <img src={usuario.foto} alt={displayName} />
              ) : (
                <span>👤</span>
              )}
            </div>
            <div className="private-user-summary">
              <span className="private-user-name">{displayName}</span>
              <span className="private-user-role">{roleLabel}</span>
            </div>
            <span className="private-user-caret">{menuAbierto ? "▴" : "▾"}</span>
          </button>

          {menuAbierto && (
            <div className="private-user-dropdown">
              <div className="private-user-dropdown-name">{displayName}</div>
              <button
                type="button"
                className="private-user-dropdown-logout"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>

      <main className="private-main">
        {credencial === "admin" && (
          <Routes>
            <Route path="/Docentes" element={<Docentes />} />
            <Route path="*" element={<Navigate to="/Docentes" />} />
          </Routes>
        )}

        {(credencial === "docente" || credencial === "director") && (
          <Routes>
            <Route path="/Alumnos" element={<Alumnos />} />
            <Route path="/Grupos" element={<Grupos />} />
            <Route path="/Ejercicios" element={<Ejercicios />} />
            <Route path="*" element={<Navigate to="/Alumnos" />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default Privado;
