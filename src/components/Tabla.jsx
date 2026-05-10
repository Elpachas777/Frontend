import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { verificarContraseña } from "../api/docente.api";
import "./Tabla.css";

function Tabla({
  children,
  Crear,
  obtenerDatos,
  titulo,
  Ver,
  Borrar,
  Editar,
  id,
  ocultarColumnas = [],
}) {
  const [encabezados, setEncabezados] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [datos, setDatos] = useState([]);
  const [actualizado, setActualizado] = useState(true);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarVer, setMostrarVer] = useState(false);
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);

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
    plural: titulo || "registros",
    singular: titulo || "registro",
    emoji: "📋",
    descripcion: "Administra la información disponible.",
  };

  const cerrarCrear = () => {
    setMostrarModal(false);
  };

  const cerrarEditar = () => {
    setMostrarEditar(false);
    setFilaSeleccionada(null);
  };

  const cerrarVer = () => {
    setMostrarVer(false);
    setFilaSeleccionada(null);
  };

  const handleCrear = () => {
    setMostrarModal(true);
  };

  const handleEditar = (fila) => {
    setFilaSeleccionada(fila);
    setMostrarEditar(true);
  };

  const handleVer = (fila) => {
    setFilaSeleccionada(fila);
    setMostrarVer(true);
  };

  const handleBorrar = async (fila) => {
    if (!Borrar) return;

    const result = await Swal.fire({
      title: "Confirmación requerida",
      html: `Ingresa la contraseña de tu usuario para eliminar el ${config.singular}.`,
      icon: "warning",
      input: "password",
      inputPlaceholder: "Contraseña",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      focusCancel: true,
      preConfirm: async (value) => {
        if (!value) {
          Swal.showValidationMessage(
            "Debes ingresar tu contraseña para confirmar.",
          );
          return false;
        }

        const esValida = await verificarContraseña(value);
        if (!esValida) {
          Swal.showValidationMessage(
            "Esa no es la contraseña correcta. Inténtalo de nuevo.",
          );
          return false;
        }

        return value;
      },
    });

    if (!result.isConfirmed || !result.value) return;

    try {
      await Borrar(fila.id != null ? fila.id : fila);

      setActualizado((prev) => !prev);

      await Swal.fire({
        title: "Eliminado",
        text: `${
          config.singular.charAt(0).toUpperCase() + config.singular.slice(1)
        } eliminado correctamente.`,
        icon: "success",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      console.log(error);

      Swal.fire({
        title: "Error",
        text: "No se pudo eliminar el registro. Intenta de nuevo.",
        icon: "error",
      });
    }
  };

  const ocultarColumnasKey = ocultarColumnas.join(",");

  useEffect(() => {
    const consultarDatos = async () => {
      try {
        if (!obtenerDatos) return;

        const response = await obtenerDatos(id);
        const datosRespuesta = Array.isArray(response) ? response : [];

        setDatos(datosRespuesta);

        if (datosRespuesta.length > 0) {
          const columnas = Object.keys(datosRespuesta[0]).filter(
            (columna) => !ocultarColumnas.includes(columna),
          );

          setEncabezados(columnas);
        } else {
          setEncabezados([]);
        }
      } catch (error) {
        console.log(error);
        setDatos([]);
        setEncabezados([]);
      }
    };

    consultarDatos();
    // ocultarColumnasKey es la versión estable (string) de ocultarColumnas
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actualizado, id, ocultarColumnasKey]);

  return (
    <section className="tabla-container">
      <div className="tabla-decor tabla-decor--one" />
      <div className="tabla-decor tabla-decor--two" />

      <div className="tabla-hero">
        <div className="tabla-hero-copy">
          <h1>Lista de {config.plural}</h1>
          <p>{config.descripcion}</p>
        </div>

        {Crear && (
          <div className="ejercicios-header">
            <button className="crear-btn" name="crear" onClick={handleCrear}>
              + Crear nuevo {config.singular}
            </button>
          </div>
        )}
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
                        type="button"
                        className="btn btn-ver"
                        name="ver"
                        onClick={() => handleVer(fila)}
                      >
                        Ver
                      </button>
                    )}

                    {Editar && (
                      <button
                        type="button"
                        className="btn btn-editar"
                        name="editar"
                        onClick={() => handleEditar(fila)}
                      >
                        Editar
                      </button>
                    )}

                    {Borrar && (
                      <button
                        type="button"
                        className="btn btn-eliminar"
                        name="eliminar"
                        onClick={() => handleBorrar(fila)}
                      >
                        Eliminar
                      </button>
                    )}
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
                      Cuando agregues un nuevo {config.singular}, aparecerá
                      aquí.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {children}

      {mostrarVer && filaSeleccionada && Ver && (
        <Ver
          onCerrar={cerrarVer}
          id={filaSeleccionada.id}
          filaSeleccionada={filaSeleccionada}
        />
      )}

      {mostrarModal && Crear && (
        <Crear setActualizado={setActualizado} onCerrar={cerrarCrear} id={id} />
      )}

      {mostrarEditar && filaSeleccionada && Editar && (
        <Editar
          setActualizado={setActualizado}
          onCerrar={cerrarEditar}
          filaSeleccionada={filaSeleccionada}
        />
      )}
    </section>
  );
}

export default Tabla;
