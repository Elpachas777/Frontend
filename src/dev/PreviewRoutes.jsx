import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../LandingPage";
import Login from "../sesion/Login";
import Registro from "../admin/Registro";
import Recuperar from "../sesion/Recuperar";
import RecuperarContra from "../sesion/RecuperarContra";
import RegistrarAdmin from "../sesion/RegistroAdmin";
import DesignHub from "./DesignHub";
import PreviewLayout from "./PreviewLayout";
import {
  PreviewAlumnos,
  PreviewGrupos,
} from "./PreviewTables";
import DocentesAdmin from "../RolAdmin/DocentesAdmin";
import EscuelasAdmin from "../RolAdmin/Escuelas";
import Ejercicios from "../docente/Ejercicios";
import Asignar from "../docente/Asignar";

function PreviewRoutes() {
  const noop = () => {};

  return (
    <Routes>
      <Route path="/design" element={<DesignHub />} />

      <Route
        path="/preview/landing"
        element={
          <PreviewLayout>
            <LandingPage />
          </PreviewLayout>
        }
      />

      <Route
        path="/preview/login"
        element={
          <PreviewLayout>
            <Login setAutentificado={noop} />
          </PreviewLayout>
        }
      />

      <Route
        path="/preview/registro"
        element={
          <PreviewLayout>
            <Registro onCerrar={noop} setActualizado={noop} />
          </PreviewLayout>
        }
      />

      <Route
        path="/preview/registro-admin"
        element={
          <PreviewLayout>
            <RegistrarAdmin />
          </PreviewLayout>
        }
      />

      <Route
        path="/preview/recuperar"
        element={
          <PreviewLayout>
            <Recuperar />
          </PreviewLayout>
        }
      />

      <Route
        path="/preview/restablecer"
        element={
          <PreviewLayout>
            <RecuperarContra />
          </PreviewLayout>
        }
      />

      <Route
        path="/preview/admin/docentes"
        element={
          <PreviewLayout credencial="admin">
            <DocentesAdmin />
          </PreviewLayout>
        }
      />

      <Route
        path="/preview/admin/escuelas"
        element={
          <PreviewLayout credencial="admin">
            <EscuelasAdmin />
          </PreviewLayout>
        }
      />

      <Route
        path="/preview/docente/alumnos"
        element={
          <PreviewLayout credencial="docente">
            <PreviewAlumnos />
          </PreviewLayout>
        }
      />

      <Route
        path="/preview/docente/grupos"
        element={
          <PreviewLayout credencial="docente">
            <PreviewGrupos />
          </PreviewLayout>
        }
      />

      <Route
        path="/preview/docente/ejercicios"
        element={
          <PreviewLayout credencial="docente">
            <Ejercicios />
          </PreviewLayout>
        }
      />

      <Route
        path="/preview/docente/asignar"
        element={
          <PreviewLayout credencial="docente">
            <Asignar />
          </PreviewLayout>
        }
      />

      <Route path="*" element={<Navigate to="/design" replace />} />
    </Routes>
  );
}

export default PreviewRoutes;
