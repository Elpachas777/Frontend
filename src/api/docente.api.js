import axios from "axios";

export const crear = async (data) => {
  const res = await axios.post("/registrarDocente", data);
  return res.data;
};

export const verDocentes = async () => {
  const res = await axios.get("/verDocentes");
  return res.data;
};

export const verDocente = async (id) => {
  const res = await axios.get(`/verDocente/${id}`);
  return res.data;
};

export const eliminarDocente = async (id) => {
  const res = await axios.delete(`/eliminarDocente/${id}`);
  return res.data;
};

export const editarDocente = async (id, data) => {
  const res = await axios.put(`/editarDocente/${id}`, data);
  return res.data;
};

export const cambiarHabilitado = async (id, data) => {
  const res = await axios.put(`/cambiarHabilitado/${id}`, data);
  return res.data;
};

export const verificarContraseña = async (id, data) => {
  const res = await axios.put(`/verificarContra/${id}`, data);
  return res.data;
};
