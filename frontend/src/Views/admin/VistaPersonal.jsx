import { Users, LayoutGrid, AlertTriangle, UserPlus, Pencil, Trash2 } from 'lucide-react';
import { Button } from "../../components/ui/Button";

// Componente de Vista Personal
export default function VistaPersonal() {
    const profesionales = [
      { id: '01', nombre: 'Alex Pérez', especialidad: 'Pediatría', rol: 'Profesional' },
      { id: '02', nombre: 'Alex Pérez', especialidad: 'Pediatría', rol: 'Editor' },
      { id: '03', nombre: 'Alex a Towas', especialidad: 'Pediatría', rol: 'Profesional' },
      { id: '04', nombre: 'Alex a Namev', especialidad: 'Pediatría', rol: 'Profesional' },
      { id: '05', nombre: 'Alex Pérez', especialidad: 'Pediatría', rol: 'Profesional' },
      { id: '06', nombre: 'Alex Paurez', especialidad: 'Pediatría', rol: 'Profesional' },
    ];
  
    return (
      <div className="p-6">
        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Profesionales Activos */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Profesionales</p>
                <p className="text-gray-500 text-sm">Activos</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">154</p>
              </div>
              <div className="text-cyan-500">
                <Users size={28} />
              </div>
            </div>
          </div>
  
          {/* Especialidades Registradas */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Especialidades</p>
                <p className="text-gray-500 text-sm">Registradas</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">28</p>
              </div>
              <div className="text-cyan-500">
                <LayoutGrid size={28} />
              </div>
            </div>
          </div>
  
          {/* Solicitudes Pendientes */}
          <div className="bg-red-50 rounded-2xl p-5 shadow-sm border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-400 text-sm font-medium">Solicitudes</p>
                <p className="text-red-400 text-sm">Pendientes</p>
                <p className="text-4xl font-bold text-red-500 mt-2">7</p>
              </div>
              <div className="text-red-400">
                <AlertTriangle size={28} />
              </div>
            </div>
          </div>
        </div>
  
        {/* Tabla de Personal */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-gray-600 font-medium">
                ABM de personal médico y especialidades
              </h2>
              <Button variant="default" className="w-fit">
                <UserPlus size={18} />
                Agregar Profesional
              </Button>
            </div>
          </div>
  
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-4 px-5 text-gray-500 font-medium text-sm">ID</th>
                  <th className="text-left py-4 px-5 text-gray-500 font-medium text-sm">Nombre</th>
                  <th className="text-left py-4 px-5 text-gray-500 font-medium text-sm">Especialidad</th>
                  <th className="text-left py-4 px-5 text-gray-500 font-medium text-sm">Rol</th>
                  <th className="text-left py-4 px-5 text-gray-500 font-medium text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {profesionales.map((profesional, index) => (
                  <tr
                    key={profesional.id}
                    className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                      index % 2 === 1 ? 'bg-gray-50/50' : ''
                    }`}
                  >
                    <td className="py-4 px-5 text-gray-600">{profesional.id}</td>
                    <td className="py-4 px-5 text-cyan-600 font-medium">{profesional.nombre}</td>
                    <td className="py-4 px-5">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        index === 1 
                          ? 'bg-cyan-100 text-cyan-700' 
                          : 'text-gray-600'
                      }`}>
                        {profesional.especialidad}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-gray-600">{profesional.rol}</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                      <button className="inline-flex items-center justify-center p-2 rounded-lg text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 transition-colors">
                        <Pencil size={18} />
                        </button>
                        <button className="inline-flex items-center justify-center p-2 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }