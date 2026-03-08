import { useEffect, useState } from "react";
import "./Tabla.css";
import Confirmar from "./Confirmar";

function Tabla({
  children,
  Crear,
  obtenerDatos,
  titulo,
  Ver,
  Borrar,
  Editar,
  id,
}) {
  const [encabezados, setEncabezados] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [datos, setDatos] = useState([]);
  const [actualizado, setActualizado] = useState(true);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarVer, setMostrarVer] = useState(false);
  const [filaSeleccionada, SetFilaSeleccionada] = useState(null);
  const [mostrarBorrar, setMostrarBorrar] = useState(false);

  const handleEditar = (fila) => {
    setMostrarEditar(true);
    SetFilaSeleccionada(fila);
  };

  const handleVer = (fila) => {
    setMostrarVer(true);
    SetFilaSeleccionada(fila);
  };

  const handleBorrar = (fila) => {
    setMostrarBorrar(true);
    SetFilaSeleccionada(fila);
  };

  const handleCrear = async (fila) => {
    setMostrarModal(true);
    SetFilaSeleccionada(fila);
  };

  useEffect(() => {
    const consultarDatos = async () => {
      try {
        const response = await obtenerDatos(id);
        setDatos(response);

        if (response.length > 0) {
          setEncabezados(Object.keys(response[0]));
        }
      } catch (error) {
        console.log(error);
      }
    };

    consultarDatos();
  }, [actualizado]);

  return (
    <div className="tabla-container">
      <h1>Lista de {titulo}</h1>

      <div className="ejercicios-header">
        <button className="crear-btn" name="crear" onClick={handleCrear}>
          + Crear nuevo {titulo}
        </button>
      </div>

      <table className="tabla">
        <thead>
          <tr>
            {encabezados.map((columna, valor) => (
              <th key={valor}>{columna}</th>
            ))}
            <th key="acciones">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos &&
            datos.length > 0 &&
            datos.map((fila, valor) => (
              <tr key={valor}>
                {encabezados.map((columna, valor) => (
                  <td key={valor}>{fila[columna]}</td>
                ))}

                <td key="acciones" className="acciones">
                  {Ver && (
                    <button
                      className="btn editar"
                      name="editar"
                      style={{ backgroundColor: "green" }}
                      onClick={() => handleVer(fila)}
                    >
                      Ver
                    </button>
                  )}

                  <button
                    className="btn editar"
                    name="editar"
                    onClick={() => handleEditar(fila)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn eliminar"
                    name="eliminar"
                    onClick={() => handleBorrar(fila)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {children}
      {mostrarVer && (
        <Ver onCerrar={() => setMostrarVer(false)} id={filaSeleccionada.id} />
      )}
      {mostrarModal && (
        <Crear
          setActualizado={setActualizado}
          onCerrar={() => setMostrarModal(false)}
          id={id}
        />
      )}
      {mostrarEditar && (
        <Editar
          setActualizado={setActualizado}
          onCerrar={() => setMostrarEditar(false)}
          filaSeleccionada={filaSeleccionada}
        />
      )}
      {mostrarBorrar && (
        <Confirmar
          onCerrar={() => setMostrarBorrar(false)}
          filaSeleccionada={filaSeleccionada}
          Borrar={Borrar}
          setActualizado={setActualizado}
        />
      )}
    </div>
  );
}

export default Tabla;
