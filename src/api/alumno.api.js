import axios from "axios";
const urlBack = import.meta.env.VITE_URL_BACKEND;
export const verAlumnos = async () => {
  const res = await axios.get(`${urlBack}/verAlumnos`);
  return res.data;
};

export const verAlumno = async (data) => {
  const res = await axios.get(`${urlBack}/verAlumno/${data}`);
  return res.data;
};

export const registrarAlumno = async (data) => {
  const res = await axios.post(`${urlBack}/registrarseAlumno`, data);
  return res.data;
};

export const borrarAlumno = async (data) => {
  const res = await axios.delete(`${urlBack}/eliminarAlumno/${data}`);
  return res.data;
};

export const editarAlumno = async (id, data) => {
  const res = await axios.put(`${urlBack}/actualizarAlumno/${id}`, data);
  return res.data;
};
