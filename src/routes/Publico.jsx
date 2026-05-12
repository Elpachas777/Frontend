import { Navigate, Route, Routes } from "react-router-dom";
import Registro from "../admin/Registro";
import EjercicioAlumno from "../alumno/EjercicioAlumno";
import Arrastrar from "../ejercicios/Arrastrar";
import LandingPage from "../LandingPage";
import CorreoVerificado from "../sesion/CorreoVerificado.jsx";
import Login from "../sesion/Login";
import Recuperar from "../sesion/Recuperar";
import RecuperarContra from "../sesion/RecuperarContra";
import RegistrarAdmin from "../sesion/RegistroAdmin";

function Publico({ setAutentificado }) {
  return (
    <div className="app-container">
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/Login"
            element={<Login setAutentificado={setAutentificado} />}
          />
          <Route
            path="/login"
            element={<Login setAutentificado={setAutentificado} />}
          />
          <Route
            path="/Registro"
            element={<Registro setAutentificado={setAutentificado} />}
          />
          <Route
            path="/registro"
            element={<Registro setAutentificado={setAutentificado} />}
          />
          <Route path="/RegistroAdmin" element={<RegistrarAdmin />} />
          <Route path="/registro-admin" element={<RegistrarAdmin />} />
          <Route path="/registraradmin" element={<RegistrarAdmin />} />
          <Route path="/RecuperarContraseña" element={<RecuperarContra />} />
          <Route path="/recuperarcontraseña" element={<RecuperarContra />} />
          <Route path="/recuperar-contraseña" element={<RecuperarContra />} />
          <Route path="/Recuperar" element={<Recuperar />} />
          <Route path="/recuperar" element={<Recuperar />} />
          <Route path="/verificado" element={<CorreoVerificado />} />
          <Route path="/Verificado" element={<CorreoVerificado />} />
          <Route path="/Agarrar" element={<Arrastrar />} />
          <Route path="/alumno/:idAlumno" element={<EjercicioAlumno />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default Publico;
