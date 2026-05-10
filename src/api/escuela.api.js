import axios from "axios";

export const crear = async (data) => {
  const res = await axios.post("/registrarEscuela", data);
  return res.data;
};

export const actualizar = async (id, data) => {
  const res = await axios.put(`/actualizarEscuela/${id}`, data);
  return res.data
};

export const listar = async () => {
  const res = await axios.get(`/verEscuelas`);
  return res.data;
};

export const eliminar = async (id) => {
  const res = await axios.delete(`/eliminarEscuela/${id}`);
  return res.data;
};
