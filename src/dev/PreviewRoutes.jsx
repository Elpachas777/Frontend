import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../LandingPage";
import Login from "../sesion/Login";
import Registro from "../admin/Registro";
import Recuperar from "../sesion/Recuperar";
import RecuperarContra from "../sesion/RecuperarContra";
import RegistrarAdmin from "../sesion/RegistroAdmin";
import Docentes from "../admin/Docentes";
import Alumnos from "../docente/Alumnos";
import Grupos from "../docente/Grupos";
import DesignHub from "./DesignHub";
import PreviewLayout from "./PreviewLayout";

function PreviewRoutes() {
  const noop = () => {};

  return (
    <Routes>
      <Route path="/design" element={<DesignHub />} />
      <Route
        path="/preview/landing"
        element={
          <PreviewLayout title="Landing pública">
            <LandingPage />
          </PreviewLayout>
        }
      />
      <Route
        path="/preview/login"
        element={
          <PreviewLayout title="Login público">
            <Login setAutentificado={noop} />
          </PreviewLayout>
        }
      />
      <Route
        path="/preview/registro"
        element={
          <PreviewLayout title="Registro de docente">
            <Registro />
          </PreviewLayout>
        }
      />
      <Route
        path="/preview/registro-admin"
        element={
          <PreviewLayout title="Registro de administrador">
            <RegistrarAdmin />
          </PreviewLayout>
        }
      />
      <Route
        path="/preview/recuperar"
        element={
          <PreviewLayout title="Recuperar contraseña">
            <Recuperar />
          </PreviewLayout>
        }
      />
      <Route
        path="/preview/restablecer"
        element={
          <PreviewLayout title="Restablecer contraseña">
            <RecuperarContra />
          </PreviewLayout>
        }
      />
      <Route
        path="/preview/admin/docentes"
        element={
          <PreviewLayout title="Panel admin · Docentes" credencial="admin">
            <Docentes />
          </PreviewLayout>
        }
      />
      <Route
        path="/preview/docente/alumnos"
        element={
          <PreviewLayout title="Panel docente · Alumnos" credencial="docente">
            <Alumnos />
          </PreviewLayout>
        }
      />
      <Route
        path="/preview/docente/grupos"
        element={
          <PreviewLayout title="Panel docente · Grupos" credencial="docente">
            <Grupos />
          </PreviewLayout>
        }
      />
      <Route path="*" element={<Navigate to="/design" replace />} />
    </Routes>
  );
}

export default PreviewRoutes;
