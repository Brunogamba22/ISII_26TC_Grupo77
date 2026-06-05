import { Settings } from 'lucide-react';

// Componente de Asignación Automática (placeholder)
export default function AsignacionAutomatica() {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <Settings size={48} className="mx-auto text-cyan-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Asignación Automática</h2>
          <p className="text-gray-500">
            Módulo de asignación automática de guardias médicas
          </p>
        </div>
      </div>
    );
  }