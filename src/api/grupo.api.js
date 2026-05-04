import axios from "axios";
const urlBack = import.meta.env.VITE_URL_BACKEND;
export const crearGrupo = async (data) => {
  const res = await axios.post(`${urlBack}/registrarseGrupo`, data, {
    withCredentials: true,
  });
  return res.data;
};

export const listar = async () => {
  const res = await axios.get(`${urlBack}/verGrupos`);
  return res.data;
};

export const eliminar = async (id) => {
  const res = await axios.delete(`${urlBack}/eliminarGrupo/${id}`);
  return res.data;
};

export const editarGrupo = async (id, data) => {
  const res = await axios.put(`${urlBack}/actualizarGrupo/${id}`, data);
  return res.data;
};

export const agregarAlumno = async (id, data) => {
  const res = await axios.put(`${urlBack}/agregarAlumno`, {
    id,
    data,
  });
  return res.data;
};

export const verGrupo = async (id) => {
  const respuesta = await axios.get(`${urlBack}/verAlumnosGrupo/${id}`);
  return respuesta.data;
};
