// src/Views/profesional/ProfesionalPanel.jsx
import { useState } from 'react';

import {
  Shield,
  Home,
  Calendar,
  RefreshCw,
  User
} from 'lucide-react';

import VistaInicio from './pages/VistaInicio';
import VistaAgenda from './pages/VistaAgenda';
import VistaPerfil from './pages/VistaPerfil';
import VistaGuardias from './pages/VistaGuardias';
import '../../styles/profesional.css'


/**
 * Panel Profesional Principal
 * 
 * Maneja la navegación interna mediante un estado `vistaActiva`.
 * Cada vista recibe la función `setVistaActiva` para poder cambiar la pantalla activa
 * (por ejemplo, volver al inicio desde la vista de guardias).
 */
export default function ProfesionalPanel() {
  const [vistaActiva, setVistaActiva] = useState('inicio');

  // Menú lateral
  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: Home },
    { id: 'agenda', label: 'Mi Agenda', icon: Calendar },
    { id: 'guardias', label: 'Mis Guardias', icon: RefreshCw },
    { id: 'perfil', label: 'Mi Perfil', icon: User },
  ];

  // Render dinámico de vistas
  const renderVista = () => {
    switch (vistaActiva) {
      case 'inicio':
        return (
          <VistaInicio
            setVistaActiva={setVistaActiva}
          />
        );

      case 'agenda':
        return <VistaAgenda />;

      case 'guardias':
        // ✅ Pasamos setVistaActiva para que VistaGuardias pueda llamar a irAlInicio
        return <VistaGuardias setVistaActiva={setVistaActiva} />;

      case 'perfil':
        return <VistaPerfil />;

      default:
        return <VistaInicio setVistaActiva={setVistaActiva} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-cyan-50 flex">

      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-cyan-100 to-cyan-50 min-h-screen p-4 flex flex-col shadow-lg">

        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 mb-8">
          <div className="text-cyan-600">
            <Shield size={32} />
          </div>

          <span className="text-2xl font-bold text-cyan-800">
            MediGuard Pro
          </span>
        </div>

        {/* Navegación */}
        <nav className="flex-1 space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = vistaActiva === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setVistaActiva(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl transition-all duration-200 text-left ${
                  isActive
                    ? 'bg-white shadow-md text-cyan-700 font-semibold'
                    : 'text-gray-600 hover:bg-white/60 hover:text-cyan-600'
                }`}
              >
                <Icon
                  size={22}
                  className={
                    isActive
                      ? 'text-cyan-600'
                      : 'text-gray-500'
                  }
                />

                <span className="text-sm">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 overflow-auto p-8">
        {renderVista()}
      </main>
    </div>
  );
}