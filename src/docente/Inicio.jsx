import "./Inicio.css";
function Inicio() {
  return (
    <div className="inicio-container">
      <h1>Bienvenido de nuevo</h1>

      <div className="cards-container">
        <div className="card">
          <h3>Crear Ejercicio</h3>
          <p>Crea nuevos ejercicios</p>
          <button className="card-btn">Ir</button>
        </div>

        <div className="card">
          <h3>Ver Usuarios</h3>
          <p>Administra a los usuarios</p>
          <button className="card-btn">Ver</button>
        </div>

        <div className="card">
          <h3>Configuraciones</h3>
          <p>Personaliza tu perfil</p>
          <button className="card-btn">Configurar</button>
        </div>
      </div>
    </div>
  );
}

export default Inicio;
