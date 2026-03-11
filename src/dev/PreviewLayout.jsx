import { Link } from "react-router-dom";
import SideBar from "../components/SideBar";

function PreviewLayout({ title, credencial = null, children }) {
  return (
    <div className="app-container" style={{ minHeight: "100vh", width: "100%" }}>
      {credencial && <SideBar credencial={credencial} />}

      <div
        style={{
          marginLeft: credencial ? "220px" : "0",
          padding: "24px",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        
        {children}
      </div>
    </div>
  );
}

export default PreviewLayout;
