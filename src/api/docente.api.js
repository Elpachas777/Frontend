import axios from "axios";

export const registrarDocente = async (data) => {
  const res = await axios.post("http://localhost:4000/registrarDocente", data);
  return res.data;
};

export const verDocentes = async () => {
  const res = await axios.get("http://localhost:4000/verDocentes");
  return res.data;
};

export const verDocente = async (data) => {
  const res = await axios.get(`http://localhost:4000/verDocente/${data}`);
  return res.data;
};

export const eliminarDocente = async (data) => {
  const res = await axios.delete(
    `http://localhost:4000/eliminarDocente/${data}`
  );
  return res.data;
};

export const editarDocente = async (id, data) => {
  const res = await axios.put(
    `http://localhost:4000/editarDocente/${id}`,
    data
  );

  return res.data;
};
