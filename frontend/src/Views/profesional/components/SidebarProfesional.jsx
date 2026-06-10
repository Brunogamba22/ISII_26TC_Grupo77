// Path: src/Views/profesional/components/SidebarProfesional.jsx
// Sidebar del Panel Profesional
// Mismo estilo visual que el sidebar del administrador

import { Home, Calendar, RefreshCw, User, Plus, LogOut } from 'lucide-react'

function SidebarProfesional({ vistaActiva, setVistaActiva }) {
  // Items de navegación del profesional
  const navItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'agenda', label: 'Mi Agenda', icon: Calendar },
    { id: 'guardias', label: 'Mis Guardias', icon: RefreshCw },
    { id: 'perfil', label: 'Mi Perfil', icon: User },
  ]

  return (
    <aside className="sidebar-profesional">
      {/* Logo y nombre de la aplicación */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Plus size={24} strokeWidth={3} />
        </div>
        <span className="sidebar-logo-text">MediGuard Pro</span>
      </div>

      {/* Navegación principal */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const IconComponent = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setVistaActiva(item.id)}
              className={`sidebar-nav-item ${vistaActiva === item.id ? 'active' : ''}`}
            >
              <IconComponent size={20} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto mb-4 mx-3">
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left text-red-300 hover:bg-red-500/20 hover:text-red-200 font-medium bg-transparent shadow-none border-none"
          style={{ margin: 0 }}
        >
          <LogOut size={20} />
          <span className="text-sm">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  )
}

export default SidebarProfesional
