import { useNavigate } from "react-router-dom";

function LadingPage() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/Login");
  };
  return (
    <>
      <div className="form-wrap">
        <h1 className="title">Bienvenido</h1>
        <div className="areas">
          <div className="area">
            <label htmlFor="id">Ingrese el ID de la clase</label>
            <input type="text" id="id" placeholder="3BC" />
          </div>
        </div>

        <button className="corner-btn" onClick={handleClick}>
          ¿Eres docente?
        </button>
      </div>
    </>
  );
}
export default LadingPage;
