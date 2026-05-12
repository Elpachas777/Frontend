import axios from "axios";
export const listar = async () => {
  const res = await axios.get("/verAlumnos");
  return res.data;
};

export const verAlumno = async (id) => {
  const res = await axios.get(`/verAlumno/${id}`);
  return res.data;
};

export const crear = async (data) => {
  const res = await axios.post("/registrarseAlumno", data);
  return res.data;
};

export const eliminar = async (id) => {
  const res = await axios.delete(`/eliminarAlumno/${id}`);
  return res.data;
};

export const actualizar = async (id, data) => {
  const res = await axios.put(`/actualizarAlumno/${id}`, data);
  return res.data;
};

// Returns: { alumno: { nombre, id_alumno }, ejercicios: [...] }
export const obtenerEjerciciosAlumno = async (id) => {
  const res = await axios.get(`/ejerciciosAlumno/${id}`);
  return res.data;
};
