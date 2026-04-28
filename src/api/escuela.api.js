import axios from "axios"

const urlBack = import.meta.env.VITE_URL_BACKEND;

export const obtenerEscuelas = async (data) => {
  const res = await axios.get(`${urlBack}/verEscuelas`);
  return res.data;
};
