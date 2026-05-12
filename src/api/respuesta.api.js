import axios from "../utils/axios.js";

export const registrarIntento = async (data) => {
  const res = await axios.post("/respuesta", data);
  return res.data;
};

export const obtenerResultadosAlumno = async (idIngreso) => {
  const res = await axios.get(`/resultadosAlumno/${idIngreso}`);
  return res.data;
};

export const obtenerResultadosAlumnoEjercicio = async (
  idIngreso,
  idEjercicio,
) => {
  const res = await axios.get(
    `/resultadosAlumno/${idIngreso}/ejercicio/${idEjercicio}`,
  );
  return res.data;
};

export const obtenerSilabasDificiles = async (idIngreso) => {
  const res = await axios.get(`/silabasDificiles/${idIngreso}`);
  return res.data;
};