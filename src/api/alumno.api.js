import axios from "axios";
const urlBack = import.meta.env.VITE_URL_BACKEND;
export const listar = async () => {
  const res = await axios.get(`${urlBack}/verAlumnos`);
  return res.data;
};

export const verAlumno = async (data) => {
  const res = await axios.get(`${urlBack}/verAlumno/${data}`);
  return res.data;
};

export const crear = async (data) => {
  const res = await axios.post(`${urlBack}/registrarseAlumno`, data);
  return res.data;
};

export const eliminar = async (id) => {
  const res = await axios.delete(`${urlBack}/eliminarAlumno/${id}`);
  return res.data;
};

export const actualizar = async (id, data) => {
  const res = await axios.put(`${urlBack}/actualizarAlumno/${id}`, data);
  return res.data;
};
