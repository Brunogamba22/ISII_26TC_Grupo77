// Path: src/Views/profesional/pages/VistaInicio.jsx
// Vista de inicio del Panel Profesional
// Replica exactamente el mockup con saludo, cards de guardias y botones

import HeaderProfesional from '../components/HeaderProfesional.jsx'
import GuardiasCard from '../components/GuardiasCard.jsx'
import BotonesAccion from '../components/BotonesAccion.jsx'

function VistaInicio() {
  // Datos del profesional
  const nombreDoctor = 'Alex Pérez'

  // Datos de las próximas guardias (según mockup)
  const proximasGuardias = [
    {
      dia: '12',
      mes: 'May',
      diaSemana: 'Jueves',
      horario: '08:00 - 20:00',
      especialidad: 'Urgencias Generales',
      hospital: '- Hosp. Central'
    },
    {
      dia: '14',
      mes: 'May',
      diaSemana: 'Sábado',
      horario: '20:00 - 08:00 (Sig.)',
      especialidad: 'Pediatría',
      hospital: '- Clínica Materno'
    },
    {
      dia: '15',
      mes: 'May',
      diaSemana: 'Domingo',
      horario: '12:00 - 20:00',
      especialidad: 'Medicina Interna',
      hospital: '- Hosp. Central'
    }
  ]

  // Handlers para los botones de acción
  const handleSolicitarCambio = () => {
    alert('Funcionalidad: Solicitar cambio de guardia')
  }

  const handleConfirmarAsistencia = () => {
    alert('Asistencia confirmada correctamente')
  }

  return (
    <div className="vista-inicio">
      {/* Header con saludo */}
      <HeaderProfesional nombreDoctor={nombreDoctor} />

      {/* Sección de próximas guardias */}
      <section className="guardias-section">
        <h2 className="guardias-title">Mis Próximas Guardias</h2>
        
        {/* Grid de cards de guardias */}
        <div className="guardias-grid">
          {proximasGuardias.map((guardia, index) => (
            <GuardiasCard key={index} guardia={guardia} />
          ))}
        </div>

        {/* Botones de acción */}
        <BotonesAccion 
          onSolicitarCambio={handleSolicitarCambio}
          onConfirmarAsistencia={handleConfirmarAsistencia}
        />
      </section>
    </div>
  )
}

export default VistaInicio
