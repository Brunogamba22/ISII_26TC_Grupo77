// Path: src/Views/profesional/pages/VistaAgenda.jsx
// Vista de agenda con tabla moderna de guardias

import TablaAgenda from '../components/TablaAgenda.jsx'

function VistaAgenda() {
  // Datos de ejemplo para la agenda
  const guardiasAgenda = [
    {
      fecha: '12 Mayo 2024',
      horario: '08:00 - 20:00',
      especialidad: 'Urgencias Generales',
      hospital: 'Hospital Central',
      estado: 'Confirmada'
    },
    {
      fecha: '14 Mayo 2024',
      horario: '20:00 - 08:00',
      especialidad: 'Pediatría',
      hospital: 'Clínica Materno',
      estado: 'Pendiente'
    },
    {
      fecha: '15 Mayo 2024',
      horario: '12:00 - 20:00',
      especialidad: 'Medicina Interna',
      hospital: 'Hospital Central',
      estado: 'Confirmada'
    },
    {
      fecha: '18 Mayo 2024',
      horario: '08:00 - 20:00',
      especialidad: 'Urgencias Generales',
      hospital: 'Hospital Central',
      estado: 'Pendiente'
    },
    {
      fecha: '22 Mayo 2024',
      horario: '20:00 - 08:00',
      especialidad: 'Medicina Interna',
      hospital: 'Clínica Norte',
      estado: 'Confirmada'
    },
    {
      fecha: '25 Mayo 2024',
      horario: '08:00 - 20:00',
      especialidad: 'Pediatría',
      hospital: 'Hospital Central',
      estado: 'Cancelada'
    }
  ]

  return (
    <div className="vista-agenda">
      <header className="header-profesional">
        <h1 className="header-saludo">Mi Agenda</h1>
      </header>

      <TablaAgenda 
        guardias={guardiasAgenda} 
        titulo="Próximas Guardias Programadas"
      />
    </div>
  )
}

export default VistaAgenda
