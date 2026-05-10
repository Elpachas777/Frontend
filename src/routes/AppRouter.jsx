import { useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Privado from "../routes/Privado";
import Publico from "../routes/Publico";

function AppRouter() {
  const { autentificado, cargando, setAutentificado } = useAuth();
  const { pathname } = useLocation();

  if (cargando) {
    return null;
  }

  return autentificado ? (
    <Privado setAutentificado={setAutentificado} />
  ) : (
    <Publico setAutentificado={setAutentificado} />
  );
}

export default AppRouter;
