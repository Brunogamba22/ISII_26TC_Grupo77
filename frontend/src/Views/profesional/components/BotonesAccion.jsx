// Path: src/Views/profesional/components/BotonesAccion.jsx
// Botones de acción para solicitar cambio y confirmar asistencia

import { RefreshCw, CheckCircle } from 'lucide-react'

function BotonesAccion({ onSolicitarCambio, onConfirmarAsistencia }) {
  return (
    <div className="botones-accion">
      <button 
        className="btn btn-outline"
        onClick={onSolicitarCambio}
      >
        <RefreshCw size={18} />
        Solicitar Cambio de Guardia
      </button>
      
      <button 
        className="btn btn-primary"
        onClick={onConfirmarAsistencia}
      >
        <CheckCircle size={18} />
        Confirmar Asistencia
      </button>
    </div>
  )
}

export default BotonesAccion
