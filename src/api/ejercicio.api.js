import axios from "axios";
const urlBack = import.meta.env.VITE_URL_BACKEND;

export const verEjercicio = async () => {
  const res = await axios.get(`${urlBack}/verEjercicio`);
};

export const guardarEjercicio = async (data) => {
  const res = await axios.post(`${urlBack}/crearEjercicio`, data, {
    withCredentials: true,
  });
};
