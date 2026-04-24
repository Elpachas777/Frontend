import { Navigate, Route, Routes } from "react-router-dom";
import Registro from "../admin/Registro";
import CrearCuentos from "../ejercicios/Cuentos";
import LandingPage from "../LandingPage";
import Login from "../sesion/Login";
import Recuperar from "../sesion/Recuperar";
import RecuperarContra from "../sesion/RecuperarContra";
import RegistrarAdmin from "../sesion/RegistroAdmin";

function Publico({ setAutentificado }) {
  return (
    <div className="app-container">
      <main style={{ marginLeft: "220px", padding: "20px" }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/Login"
            element={<Login setAutentificado={setAutentificado} />}
          />
          <Route
            path="/Registro"
            element={<Registro setAutentificado={setAutentificado} />}
          />
          <Route path="/RegistroAdmin" element={<RegistrarAdmin />} />
          <Route path="/Canvas" element={<CrearCuentos />} />
          <Route path="/RecuperarContraseña" element={<RecuperarContra />} />
          <Route path="/Recuperar" element={<Recuperar />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default Publico;
