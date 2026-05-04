import axios from "axios";

const urlBack = import.meta.env.VITE_URL_BACKEND;

export const crear = async (data) => {
  const res = await axios.post(`${urlBack}/registrarEscuela`, data);
  return res.data;
};

export const actualizar = async (id, data) => {
  const res = await axios.put(`${urlBack}/actualizarEscuela/${id}`, data);
};

export const listar = async () => {
  const res = await axios.get(`${urlBack}/verEscuelas`);
  return res.data;
};

export const eliminar = async (id) => {
  const res = await axios.delete(`${urlBack}/eliminarEscuela/${id}`);
  return res.data;
};
