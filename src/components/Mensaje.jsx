import "./Mensaje.css";

export default function Mensaje({ tipo = "normal", mensaje = "" }) {
  return <div className={`mensaje mensaje-${tipo}`}>{mensaje}</div>;
}
