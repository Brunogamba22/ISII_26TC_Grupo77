// Path: src/Views/profesional/pages/VistaPerfil.jsx
// Vista de perfil del profesional con cards informativas

import { User, Stethoscope, Building2, Mail, Phone, IdCard } from 'lucide-react'

function VistaPerfil() {
  // Datos del perfil del profesional
  const perfilData = {
    nombre: 'Dr. Alex Pérez García',
    especialidad: 'Medicina Interna',
    matricula: 'MED-2024-15789',
    hospital: 'Hospital Central',
    email: 'alex.perez@mediguard.com',
    telefono: '+34 612 345 678'
  }

  return (
    <div className="vista-perfil">
      <header className="header-profesional">
        <h1 className="header-saludo">Mi Perfil</h1>
      </header>

      <div className="perfil-grid">
        {/* Card de Información Personal */}
        <div className="perfil-card">
          <div className="perfil-card-header">
            <div className="perfil-card-icon">
              <User size={24} />
            </div>
            <h3 className="perfil-card-title">Información Personal</h3>
          </div>
          <div className="perfil-info">
            <div className="perfil-info-item">
              <span className="perfil-info-label">Nombre completo</span>
              <span className="perfil-info-value">{perfilData.nombre}</span>
            </div>
            <div className="perfil-info-item">
              <span className="perfil-info-label">Matrícula</span>
              <span className="perfil-info-value">{perfilData.matricula}</span>
            </div>
          </div>
        </div>

        {/* Card de Especialidad */}
        <div className="perfil-card">
          <div className="perfil-card-header">
            <div className="perfil-card-icon">
              <Stethoscope size={24} />
            </div>
            <h3 className="perfil-card-title">Especialidad</h3>
          </div>
          <div className="perfil-info">
            <div className="perfil-info-item">
              <span className="perfil-info-label">Área médica</span>
              <span className="perfil-info-value">{perfilData.especialidad}</span>
            </div>
            <div className="perfil-info-item">
              <span className="perfil-info-label">Certificación</span>
              <span className="perfil-info-value">Vigente</span>
            </div>
          </div>
        </div>

        {/* Card de Hospital */}
        <div className="perfil-card">
          <div className="perfil-card-header">
            <div className="perfil-card-icon">
              <Building2 size={24} />
            </div>
            <h3 className="perfil-card-title">Centro de Trabajo</h3>
          </div>
          <div className="perfil-info">
            <div className="perfil-info-item">
              <span className="perfil-info-label">Hospital asignado</span>
              <span className="perfil-info-value">{perfilData.hospital}</span>
            </div>
            <div className="perfil-info-item">
              <span className="perfil-info-label">Turno habitual</span>
              <span className="perfil-info-value">Rotativo</span>
            </div>
          </div>
        </div>

        {/* Card de Contacto */}
        <div className="perfil-card">
          <div className="perfil-card-header">
            <div className="perfil-card-icon">
              <Mail size={24} />
            </div>
            <h3 className="perfil-card-title">Datos de Contacto</h3>
          </div>
          <div className="perfil-info">
            <div className="perfil-info-item">
              <span className="perfil-info-label">Email</span>
              <span className="perfil-info-value">{perfilData.email}</span>
            </div>
            <div className="perfil-info-item">
              <span className="perfil-info-label">Teléfono</span>
              <span className="perfil-info-value">{perfilData.telefono}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VistaPerfil
