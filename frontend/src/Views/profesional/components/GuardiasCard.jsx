// Path: src/Views/profesional/components/GuardiasCard.jsx
// Card individual para mostrar información de una guardia médica

function GuardiasCard({ guardia }) {
    return (
      <div className="guardia-card">
        {/* Fecha grande */}
        <div className="guardia-fecha">{guardia.dia}</div>
        <div className="guardia-mes">{guardia.mes}</div>
        <div className="guardia-dia">{guardia.diaSemana}</div>
        
        {/* Horario */}
        <div className="guardia-horario">{guardia.horario}</div>
        
        {/* Especialidad y Hospital */}
        <div className="guardia-especialidad">{guardia.especialidad}</div>
        <div className="guardia-hospital">{guardia.hospital}</div>
      </div>
    )
  }
  
  export default GuardiasCard
  