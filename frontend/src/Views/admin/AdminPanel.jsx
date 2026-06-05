
import { useState } from 'react';
import {
  Shield,
  Users,
  Stethoscope,
  Calendar,
  ClipboardCheck,
  Settings
} from 'lucide-react';

import VistaPersonal from './VistaPersonal';
import AsignacionAutomatica from './AsignacionAutomatica';
import VistaPlaceholder from './VistaPlaceholder';





// Componente Principal AdminDashboard
export default function AdminDashboard() {
  const [vistaActiva, setVistaActiva] = useState('personal');

  const menuItems = [
    { id: 'personal', label: 'Personal', icon: Users },
    { id: 'especialidades', label: 'Especialidades', icon: Stethoscope },
    { id: 'calendario', label: 'Calendario', icon: Calendar },
    { id: 'aprobaciones', label: 'Aprobaciones', icon: ClipboardCheck },
    { id: 'asignacion', label: 'Asignación Automática', icon: Settings },
  ];

  const renderVista = () => {
    switch (vistaActiva) {
      case 'personal':
        return <VistaPersonal />;
      case 'especialidades':
        return <VistaPlaceholder titulo="Especialidades" />;
      case 'calendario':
        return <VistaPlaceholder titulo="Calendario" />;
      case 'aprobaciones':
        return <VistaPlaceholder titulo="Aprobaciones" />;
      case 'asignacion':
        return <AsignacionAutomatica />;
      default:
        return <VistaPersonal />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-cyan-100 to-cyan-50 min-h-screen p-4 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 mb-6">
          <div className="text-cyan-600">
            <Shield size={32} />
          </div>
          <span className="text-xl font-bold text-cyan-800">MediGuard Pro</span>
        </div>

        {/* Navegación */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = vistaActiva === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setVistaActiva(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-white shadow-md text-cyan-700 font-medium'
                    : 'text-gray-600 hover:bg-white/50 hover:text-cyan-600'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-cyan-600' : 'text-gray-500'} />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-auto">
        {renderVista()}
      </main>
    </div>
  );
}
