import { Navigate, Route, Routes } from "react-router-dom";
import Swal from "sweetalert2";
import { cerrarSesion } from "../api/sesion.api";
import SideBar from "../components/SideBar";
import Alumnos from "../docente/Alumnos";
import Asignar from "../docente/Asignar";
import Ejercicios from "../docente/Ejercicios";
import Grupos from "../docente/Grupos";
import useCredenciales from "../hooks/useCredenciales";
import DocentesAdmin from "../RolAdmin/DocentesAdmin";
import EscuelasAdmin from "../RolAdmin/Escuelas";

function Privado({ setAutentificado }) {
  const { credencial } = useCredenciales();

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

  return (
    <div className="private-layout">
      <SideBar
        credencial={credencial.rol}
        usuario={credencial.nombre}
        onCerrarSesion={handleLogout}
      />

      <main className="private-main">
        {credencial.rol === "admin" && (
          <Routes>
            <Route path="/admin/docentes" element={<DocentesAdmin />} />
            <Route path="/admin/escuelas" element={<EscuelasAdmin />} />
            <Route path="*" element={<Navigate to="/admin/docentes" />} />
          </Routes>
        )}

        {(credencial.rol === "docente" || credencial.rol === "director") && (
          <Routes>
            <Route path="/Alumnos" element={<Alumnos />} />
            <Route path="/Grupos" element={<Grupos />} />
            <Route path="/Ejercicios" element={<Ejercicios />} />
            <Route path="/Asignar" element={<Asignar />} />
            <Route path="*" element={<Navigate to="/Alumnos" />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default Privado;
