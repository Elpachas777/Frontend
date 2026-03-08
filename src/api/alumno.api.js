import axios from "axios";

export const verAlumnos = async () => {
  const res = await axios.get("http://localhost:4000/verAlumnos");
  return res.data;
};

export const verAlumno = async (data) => {
  const res = await axios.get(`http://localhost:4000/verAlumno/${data}`);
  return res.data;
};

export const registrarAlumno = async (data) => {
  const res = await axios.post("http://localhost:4000/registrarseAlumno", data);
  return res.data;
};

export const borrarAlumno = async (data) => {
  const res = await axios.delete(
    `http://localhost:4000/eliminarAlumno/${data}`
  );
  return res.data;
};

export const editarAlumno = async (id, data) => {
  const res = await axios.put(
    `http://localhost:4000/actualizarAlumno/${id}`,
    data
  );
  return res.data;
};
