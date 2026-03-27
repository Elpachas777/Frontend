import { Routes, Route, Navigate } from "react-router-dom";
import SideBar from "../components/SideBar";
import Grupos from "../docente/Grupos";
import Docentes from "../admin/Docentes";
import Alumnos from "../docente/Alumnos";
import Ejercicios from "../docente/Ejercicios";
import { cerrarSesion } from "../api/sesion.api";
import useCredenciales from "../hooks/useCredenciales";

function Privado({ setAutentificado }) {
  const { credencial } = useCredenciales();

  const handleClick = () => {
    cerrarSesion({ setAutentificado });
  };

  return (
    <div className="private-layout">
      <SideBar credencial={credencial} />

      <button className="logout-btn" onClick={handleClick}>
        Cerrar sesión
      </button>

      <main className="private-main">
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
            <Route path="/Ejercicios" element={<Ejercicios />} />
            <Route path="*" element={<Navigate to="/Alumnos" />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default Privado;
