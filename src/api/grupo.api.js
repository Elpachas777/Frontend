import axios from "axios";

export const crearGrupo = async (data) => {
  const res = await axios.post("/registrarseGrupo", data, {
    withCredentials: true,
  });
  return res.data;
};

export const listar = async () => {
  const res = await axios.get("/verGrupos");
  return res.data;
};

export const eliminar = async (id) => {
  const res = await axios.delete(`/eliminarGrupo/${id}`);
  return res.data;
};

export const editarGrupo = async (id, data) => {
  const res = await axios.put(`/actualizarGrupo/${id}`, data);
  return res.data;
};

export const agregarAlumno = async (id, data) => {
  const res = await axios.put("/agregarAlumno", {
    id,
    data,
  });
  return res.data;
};

export const verGrupo = async (id) => {
  const respuesta = await axios.get(`/verAlumnosGrupo/${id}`);
  return respuesta.data;
};

export const agregar = async (id, data) => {
  const respuesta = await axios.put(`/agregarAlumnos/${id}`, data);
  return respuesta.data;
};

export const listarAlumnos = async (id) => {
  const respuesta = await axios.get(`/listarAlumnos/${id}`)
  return respuesta.data;
}

export const eliminarAlumno = async (id, data) => {
  const respuesta = await axios.put(`/eliminarDelGrupo/${id}`, data)
  return respuesta.data
}