import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Swal from "sweetalert2";
import { cerrarSesion } from "../api/sesion.api";
import SideBar from "../components/SideBar";
import Alumnos from "../docente/Alumnos";
import Ejercicios from "../docente/Ejercicios";
import Grupos from "../docente/Grupos";
import CrearCuentos from "../ejercicios/Cuentos";
import useCredenciales from "../hooks/useCredenciales";
import DocentesAdmin from "../RolAdmin/DocentesAdmin";
import EscuelasAdmin from "../RolAdmin/Escuelas";

function Privado({ setAutentificado }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { credencial, usuario } = useCredenciales();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "¿Cerrar sesión?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#e74c3c",
      cancelButtonColor: "#7bc043",
    });
    if (!result.isConfirmed) return;
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
      <SideBar credencial={credencial} usuario={usuario} />

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
            <span className="private-user-caret">
              {menuAbierto ? "▴" : "▾"}
            </span>
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
            <Route path="/admin/docentes" element={<DocentesAdmin />} />
            <Route path="/admin/escuelas" element={<EscuelasAdmin />} />
            <Route path="*" element={<Navigate to="/admin/docentes" />} />
          </Routes>
        )}

        {(credencial === "docente" || credencial === "director") && (
          <Routes>
            <Route path="/Alumnos" element={<Alumnos />} />
            <Route path="/Grupos" element={<Grupos />} />
            <Route path="/Ejercicios" element={<Ejercicios />} />
            <Route path="/Canvas" element={<CrearCuentos />} />
            <Route path="*" element={<Navigate to="/Alumnos" />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default Privado;
