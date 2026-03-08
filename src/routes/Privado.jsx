import { Routes, Route, Navigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import Grupos from "../docente/Grupos";
import Inicio from "../docente/Inicio";
import Docentes from "../admin/Docentes";
import Alumnos from "../docente/Alumnos";
import { cerrarSesion } from "../api/sesion.api";
import useCredenciales from "../hooks/useCredenciales";

function Privado({ setAutentificado }) {
  const { credencial } = useCredenciales();
  const handleClick = () => {
    cerrarSesion({ setAutentificado });
  };

  return (
    <div className="app-container">
      <SideBar credencial={credencial} />
      <button
        className="corner-btn"
        style={{ backgroundColor: "red" }}
        onClick={handleClick}
      >
        Cerrar Sesión
      </button>
      <main style={{ marginLeft: "220px", padding: "20px" }}>
        {credencial === "admin" && (
          <Routes>
            <Route path="/Docentes" element={<Docentes />} />
            <Route path="*" element={<Navigate to="/Docentes" />} />
          </Routes>
        )}

        {credencial === "docente" && (
          <Routes>
            <Route path="/Alumnos" element={<Alumnos />} />
            <Route path="/Grupos" element={<Grupos />} />
            <Route path="*" element={<Navigate to="/Alumnos" />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default Privado;
