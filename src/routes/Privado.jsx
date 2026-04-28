import { Navigate, Route, Routes } from "react-router-dom";
import Docentes from "../admin/Docentes";
import { cerrarSesion } from "../api/sesion.api";
import SideBar from "../components/SideBar";
import Alumnos from "../docente/Alumnos";
import Grupos from "../docente/Grupos";
import CrearCuentos from "../ejercicios/Cuentos";
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
            <Route path="/Canvas" element={<CrearCuentos />} />
            <Route path="*" element={<Navigate to="/Alumnos" />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default Privado;
