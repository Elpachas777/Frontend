import useAuth from "../hooks/useAuth";
import Privado from "../routes/Privado";
import Publico from "../routes/Publico";

function AppRouter() {
  const { autentificado, cargando, setAutentificado } = useAuth();
  console.log("API:", import.meta.env.VITE_API_URL);
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
