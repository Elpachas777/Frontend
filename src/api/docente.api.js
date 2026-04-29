import axios from "axios";
const urlBack = import.meta.env.VITE_URL_BACKEND;

export const registrarDocente = async (data) => {
  const res = await axios.post(`${urlBack}/registrarDocente`, data);
  return res.data;
};

export const verDocentes = async () => {
  const res = await axios.get(`${urlBack}/verDocentes`);
  return res.data;
};

export const verDocente = async (data) => {
  const res = await axios.get(`${urlBack}/verDocente/${data}`);
  return res.data;
};

export const eliminarDocente = async (data) => {
  const res = await axios.delete(`${urlBack}/eliminarDocente/${data}`);
  return res.data;
};

export const editarDocente = async (id, data) => {
  const res = await axios.put(`${urlBack}/editarDocente/${id}`, data);

  return res.data;
};
