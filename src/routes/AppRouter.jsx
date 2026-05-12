import useAuth from "../hooks/useAuth";
import Privado from "../routes/Privado";
import Publico from "../routes/Publico";

function AppRouter() {
  const { autentificado, cargando, setAutentificado } = useAuth();

  if (cargando) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f7fbf4",
      }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: "4px solid rgba(123,192,67,0.2)",
          borderTopColor: "#7bc043",
          animation: "spin 0.8s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return autentificado ? (
    <Privado setAutentificado={setAutentificado} />
  ) : (
    <Publico setAutentificado={setAutentificado} />
  );
}

export default AppRouter;
