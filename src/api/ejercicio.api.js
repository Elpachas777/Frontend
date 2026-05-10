import axios from "axios";

export const verEjercicio = async () => {
  const res = await axios.get("/verEjercicio");
  return res.data
};

export const guardarEjercicio = async (data) => {
  const res = await axios.post("/crearEjercicio", data, {
    withCredentials: true,
  });
  return res.data
};

export const listarTipos = async () => {
  const res = await axios.get("/obtenerTipos");
  return res.data;
};

export const listar = async () => {
  const res = await axios.get("/obtenerEjercicios");
  return res.data;
};

export const actualizar = async (id, data) => {
  const res = await axios.put(`/editarEjercicio/${id}`, data);
  return res.data;
};

export const eliminar = async (id) => {
  const res = await axios.delete(`/eliminarEjercicio/${id}`)
  return res.data
}

export const asignarEjercicio = async (id, data) => {
  const res = await axios.put(`/asignar/${id}`, data)
  return res.data
}