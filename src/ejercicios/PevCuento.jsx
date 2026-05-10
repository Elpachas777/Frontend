import "../components/Modal.css";

export default function Previsualizar({ children, onCerrar }) {
  return (
    <>
      <div className="modal-overlay">
        <div className="modal form-wrap">
          {children}
          <div className="modal-botones">
            <button type="submit">Guardar</button>
            <button onClick={onCerrar}>Cerrar</button>
          </div>
        </div>
      </div>
    </>
  );
}
