import { verDocente } from "../api/docente.api";

function login({ formData, setAutentificado }) {
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await verDocente(formData);
      console.log(res);
      if (res.status === "ok") {
        setAutentificado(true);
      } else {
        alert(res.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleSubmit,
  };
}

export default login;
