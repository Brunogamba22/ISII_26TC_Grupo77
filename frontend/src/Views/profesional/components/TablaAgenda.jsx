// Path: src/Views/profesional/components/TablaAgenda.jsx
// Tabla reutilizable para mostrar agenda de guardias

function TablaAgenda({ guardias, titulo }) {
    // Función para obtener la clase del badge según el estado
    const getEstadoClass = (estado) => {
      switch (estado.toLowerCase()) {
        case 'confirmada':
          return 'estado-badge estado-confirmada'
        case 'pendiente':
          return 'estado-badge estado-pendiente'
        case 'cancelada':
          return 'estado-badge estado-cancelada'
        default:
          return 'estado-badge'
      }
    }
  
    return (
      <div className="tabla-container">
        <div className="tabla-header">
          <h3 className="tabla-titulo">{titulo}</h3>
        </div>
        
        <table className="tabla">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Horario</th>
              <th>Especialidad</th>
              <th>Hospital</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {guardias.map((guardia, index) => (
              <tr key={index}>
                <td>{guardia.fecha}</td>
                <td>{guardia.horario}</td>
                <td>{guardia.especialidad}</td>
                <td>{guardia.hospital}</td>
                <td>
                  <span className={getEstadoClass(guardia.estado)}>
                    {guardia.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  
  export default TablaAgenda
  