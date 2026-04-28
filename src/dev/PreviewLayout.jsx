import { useNavigate } from "react-router-dom";
import SideBar from "../components/SideBar";

function PreviewLayout({ credencial = null, children }) {
  const navigate = useNavigate();
  const basePath =
    credencial === "admin"
      ? "/preview/admin"
      : credencial === "docente"
      ? "/preview/docente"
      : "";

  const handleCerrarSesion = () => {
    localStorage.removeItem("frontend_user");
    navigate("/preview/login", { replace: true });
  };

  if (!credencial) {
    return <>{children}</>;
  }

  return (
    <div className="private-layout">
      <SideBar
        credencial={credencial}
        basePath={basePath}
        onCerrarSesion={handleCerrarSesion}
      />

      <main className="private-main private-main--preview">
        {children}
      </main>
    </div>
  );
}

export default PreviewLayout;