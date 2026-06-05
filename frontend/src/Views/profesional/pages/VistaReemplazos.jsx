// Path: src/Views/profesional/pages/VistaReemplazos.jsx
// Vista para gestionar solicitudes de reemplazo de guardias

import { useState } from 'react'
import { Send, Calendar, FileText, MessageSquare } from 'lucide-react'

function VistaReemplazos() {
  // Estado del formulario
  const [formData, setFormData] = useState({
    guardia: '',
    motivo: '',
    observaciones: ''
  })

  // Guardias disponibles para solicitar reemplazo
  const guardiasDisponibles = [
    { id: 1, label: '12 Mayo - Urgencias Generales (08:00 - 20:00)' },
    { id: 2, label: '14 Mayo - Pediatría (20:00 - 08:00)' },
    { id: 3, label: '15 Mayo - Medicina Interna (12:00 - 20:00)' },
    { id: 4, label: '18 Mayo - Urgencias Generales (08:00 - 20:00)' },
    { id: 5, label: '22 Mayo - Medicina Interna (20:00 - 08:00)' },
  ]

  // Motivos predefinidos
  const motivosDisponibles = [
    'Enfermedad personal',
    'Compromiso familiar',
    'Capacitación o congreso',
    'Emergencia personal',
    'Otro'
  ]

  // Handler para cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handler para enviar la solicitud
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.guardia || !formData.motivo) {
      alert('Por favor complete los campos obligatorios')
      return
    }
    alert('Solicitud de reemplazo enviada correctamente')
    setFormData({ guardia: '', motivo: '', observaciones: '' })
  }

  return (
    <div className="vista-reemplazos">
      <header className="header-profesional">
        <h1 className="header-saludo">Gestión de Reemplazos</h1>
      </header>

      <div className="form-container">
        <h2 className="form-title">
          <FileText className="inline-block mr-2 text-primary-600" size={24} />
          Solicitar Reemplazo de Guardia
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Selector de Guardia */}
          <div className="form-group">
            <label className="form-label">
              <Calendar className="inline-block mr-2" size={16} />
              Seleccionar Guardia *
            </label>
            <select
              name="guardia"
              value={formData.guardia}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">-- Seleccione una guardia --</option>
              {guardiasDisponibles.map(guardia => (
                <option key={guardia.id} value={guardia.id}>
                  {guardia.label}
                </option>
              ))}
            </select>
          </div>

          {/* Selector de Motivo */}
          <div className="form-group">
            <label className="form-label">
              <FileText className="inline-block mr-2" size={16} />
              Motivo *
            </label>
            <select
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="">-- Seleccione un motivo --</option>
              {motivosDisponibles.map((motivo, index) => (
                <option key={index} value={motivo}>
                  {motivo}
                </option>
              ))}
            </select>
          </div>

          {/* Campo de Observaciones */}
          <div className="form-group">
            <label className="form-label">
              <MessageSquare className="inline-block mr-2" size={16} />
              Observaciones adicionales
            </label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Agregue cualquier información adicional relevante..."
            />
          </div>

          {/* Botón de envío */}
          <button type="submit" className="btn btn-primary">
            <Send size={18} />
            Enviar Solicitud
          </button>
        </form>
      </div>
    </div>
  )
}

export default VistaReemplazos
