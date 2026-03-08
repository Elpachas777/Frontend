import Privado from "../routes/Privado";
import Publico from "../routes/Publico";
import useAuth from "../hooks/useAuth";

function AppRouter() {
  const { autentificado, setAutentificado } = useAuth();

  return autentificado ? (
    <Privado setAutentificado={setAutentificado} />
  ) : (
    <Publico setAutentificado={setAutentificado} />
  );
}

export default AppRouter;
