// Path: src/Views/profesional/components/HeaderProfesional.jsx
// Header con saludo personalizado para el profesional

function HeaderProfesional({ nombreDoctor }) {
    return (
      <header className="header-profesional">
        <h1 className="header-saludo">
          ¡Hola, <span>Dr. {nombreDoctor}</span>!
        </h1>
      </header>
    )
  }
  
  export default HeaderProfesional
  