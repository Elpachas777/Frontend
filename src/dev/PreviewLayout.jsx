import SideBar from "../components/SideBar";

function PreviewLayout({ credencial = null, children }) {
  const basePath =
    credencial === "admin"
      ? "/preview/admin"
      : credencial === "docente"
      ? "/preview/docente"
      : "";

  if (!credencial) {
    return <>{children}</>;
  }

  return (
    <div className="private-layout">
      <SideBar credencial={credencial} basePath={basePath} />

      <main className="private-main private-main--preview">
        {children}
      </main>
    </div>
  );
}

export default PreviewLayout;