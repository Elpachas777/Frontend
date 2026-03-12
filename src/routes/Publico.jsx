import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../LandingPage";
import Login from "../sesion/Login";
import Registro from "../admin/Registro";
import Recuperar from "../sesion/Recuperar";
import RecuperarContra from "../sesion/RecuperarContra";
import RegistrarAdmin from "../sesion/RegistroAdmin";

function Publico({ setAutentificado }) {
  return (
    <div className="app-container">
     <main >
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

          <Route path="/RecuperarContraseña" element={<RecuperarContra />} />
          <Route path="/Recuperar" element={<Recuperar />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default Publico;
