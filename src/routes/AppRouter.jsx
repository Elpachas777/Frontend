import { useLocation } from "react-router-dom";
import Privado from "../routes/Privado";
import Publico from "../routes/Publico";
import PreviewRoutes from "../dev/PreviewRoutes";
import useAuth from "../hooks/useAuth";

function AppRouter() {
  const { autentificado, cargando, setAutentificado } = useAuth();
  const { pathname } = useLocation();

  const previewMode =
    import.meta.env.DEV || import.meta.env.VITE_PREVIEW_MODE === "true";

  const isPreviewRoute =
    pathname.startsWith("/design") || pathname.startsWith("/preview/");

  if (previewMode && isPreviewRoute) {
    return <PreviewRoutes />;
  }

  return autentificado ? (
    <Privado setAutentificado={setAutentificado} />
  ) : (
    <Publico setAutentificado={setAutentificado} />
  );
}

export default AppRouter;