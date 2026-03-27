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
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [mostrarBorrar, setMostrarBorrar] = useState(false);

  const textos = {
    docentes: {
      plural: "docentes",
      singular: "docente",
      emoji: "🧑‍🏫",
      descripcion: "Administra fácilmente a los docentes registrados.",
    },
    alumnos: {
      plural: "alumnos",
      singular: "alumno",
      emoji: "🧒",
      descripcion: "Consulta y organiza a tus alumnos de forma sencilla.",
    },
    grupo: {
      plural: "grupos",
      singular: "grupo",
      emoji: "👨‍👩‍👧‍👦",
      descripcion: "Gestiona grupos y revisa quiénes pertenecen a cada uno.",
    },
    ejercicios: {
      plural: "ejercicios",
      singular: "ejercicio",
      emoji: "🧩",
      descripcion: "Crea y organiza ejercicios para tus alumnos.",
    },
  };

  const config = textos[titulo] || {
    plural: titulo,
    singular: titulo,
    emoji: "📋",
    descripcion: "Administra la información disponible.",
  };

  const handleEditar = (fila) => {
    setMostrarEditar(true);
    setFilaSeleccionada(fila);
  };

  const handleVer = (fila) => {
    setMostrarVer(true);
    setFilaSeleccionada(fila);
  };

  const handleBorrar = (fila) => {
    setMostrarBorrar(true);
    setFilaSeleccionada(fila);
  };

  const handleCrear = () => {
    setMostrarModal(true);
  };

  useEffect(() => {
    const consultarDatos = async () => {
      try {
        const response = await obtenerDatos(id);
        setDatos(response);

        if (response.length > 0) {
          setEncabezados(Object.keys(response[0]));
        } else {
          setEncabezados([]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    consultarDatos();
  }, [actualizado, obtenerDatos, id]);

  return (
    <section className="tabla-container">
      <div className="tabla-decor tabla-decor--one" />
      <div className="tabla-decor tabla-decor--two" />

      <div className="tabla-hero">
        <div className="tabla-hero-copy">
          <span className="tabla-badge">{config.emoji} Panel</span>
          <h1>Lista de {config.plural}</h1>
          <p>{config.descripcion}</p>
        </div>

        <div className="ejercicios-header">
          <button className="crear-btn" name="crear" onClick={handleCrear}>
            + Crear nuevo {config.singular}
          </button>
        </div>
      </div>

      <div className="tabla-wrap">
        <table className="tabla">
          <thead>
            <tr>
              {encabezados.map((columna) => (
                <th key={columna}>{columna}</th>
              ))}
              <th key="acciones">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {datos && datos.length > 0 ? (
              datos.map((fila, filaIndex) => (
                <tr key={fila.id ?? filaIndex}>
                  {encabezados.map((columna) => (
                    <td key={`${fila.id ?? filaIndex}-${columna}`}>
                      {fila[columna]}
                    </td>
                  ))}

                  <td className="acciones">
                    {Ver && (
                      <button
                        className="btn btn-ver"
                        name="ver"
                        onClick={() => handleVer(fila)}
                      >
                        Ver
                      </button>
                    )}

                    <button
                      className="btn btn-editar"
                      name="editar"
                      onClick={() => handleEditar(fila)}
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-eliminar"
                      name="eliminar"
                      onClick={() => handleBorrar(fila)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={encabezados.length + 1}>
                  <div className="tabla-empty">
                    <span className="tabla-empty-icon">🌱</span>
                    <h3>Aún no hay registros</h3>
                    <p>
                      Cuando agregues un nuevo {config.singular}, aparecerá aquí.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {children}

      {mostrarVer && filaSeleccionada && (
        <Ver
          onCerrar={() => setMostrarVer(false)}
          filaSeleccionada={filaSeleccionada}
          {...filaSeleccionada}
        />
      )}

      {mostrarModal && (
        <Crear
          setActualizado={setActualizado}
          onCerrar={() => setMostrarModal(false)}
          id={id}
        />
      )}

      {mostrarEditar && filaSeleccionada && (
        <Editar
          setActualizado={setActualizado}
          onCerrar={() => setMostrarEditar(false)}
          filaSeleccionada={filaSeleccionada}
        />
      )}

      {mostrarBorrar && filaSeleccionada && (
        <Confirmar
          onCerrar={() => setMostrarBorrar(false)}
          filaSeleccionada={filaSeleccionada}
          Borrar={Borrar}
          setActualizado={setActualizado}
        />
      )}
    </section>
  );
}

export default Tabla;