import axios from "axios";

export const crearGrupo = async (data) => {
  const res = await axios.post("http://localhost:4000/registrarseGrupo", data);
  return res.data;
};

export const verGrupos = async () => {
  const res = await axios.get("http://localhost:4000/verGrupos");
  return res.data;
};

export const borrarGrupo = async (data) => {
  const res = await axios.delete(`http://localhost:4000/eliminarGrupo/${data}`);
  return res.data;
};

export const editarGrupo = async (id, data) => {
  const res = await axios.put(
    `http://localhost:4000/actualizarGrupo/${id}`,
    data
  );
  return res.data;
};

export const agregarAlumno = async (id, data) => {
  const res = await axios.put("http://localhost:4000/agregarAlumno", {
    id,
    data,
  });
  return res.data;
};

export const verGrupo = async (id) => {
  const respuesta = await axios.get(
    `http://localhost:4000/verAlumnosGrupo/${id}`
  );
  return respuesta.data;
};
