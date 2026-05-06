function VerCuento({ contenido }) {
  return (
    <>
      <div className="contenedor">
        <strong>Silaba</strong>
        <div className="contenedor-valor">{contenido.silaba}</div>
      </div>

      <div className="contenedor">
        <strong>Cuento</strong>
        <div className="contenedor-valor">{contenido.cuento}</div>
      </div>
    </>
  );
}

export default VerCuento;
