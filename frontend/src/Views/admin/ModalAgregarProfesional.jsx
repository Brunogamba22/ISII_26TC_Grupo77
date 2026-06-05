

import { Shield, X, User, Mail, Lock, Stethoscope, Briefcase, Loader2 } from 'lucide-react';

export default function ModalAgregarProfesional({
  isOpen = false,
  onClose,
  onSubmit,
  isLoading = false,
  formData = {
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    id_especialidad: '',
    id_rol: '',
  },
  onFieldChange,
  especialidades = [], 
  roles = [],
  error = '',
}) {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(e);
  };

  const handleFieldChange = (field) => (e) => {
    if (onFieldChange) onFieldChange(field, e.target.value);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg transform transition-all overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Agregar Profesional</h2>
            <p className="text-sm text-gray-500 mt-1">Complete los datos para dar de alta en el sistema</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}

          {/* Dos columnas para Nombre y Apellido */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="nombre" className="block text-xs font-medium text-gray-700">Nombre</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  id="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={handleFieldChange('nombre')}
                  disabled={isLoading}
                  placeholder="Juan"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="apellido" className="block text-xs font-medium text-gray-700">Apellido</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  id="apellido"
                  type="text"
                  value={formData.apellido}
                  onChange={handleFieldChange('apellido')}
                  disabled={isLoading}
                  placeholder="García"
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label htmlFor="modal-email" className="block text-xs font-medium text-gray-700">Correo electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-4 h-4 text-gray-400" />
              </div>
              <input
                id="modal-email"
                type="email"
                value={formData.email}
                onChange={handleFieldChange('email')}
                disabled={isLoading}
                placeholder="doctor@hospital.com"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="space-y-1">
            <label htmlFor="password" className="block text-xs font-medium text-gray-700">Contraseña inicial</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={formData.contrasena}
                onChange={handleFieldChange('contrasena')}
                disabled={isLoading}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          {/* Especialidad y Rol en dos columnas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Especialidad */}
            <div className="space-y-1">
              <label htmlFor="especialidad" className="block text-xs font-medium text-gray-700">Especialidad</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Stethoscope className="w-4 h-4 text-gray-400" />
                </div>
                <select
                  id="especialidad"
                  value={formData.id_especialidad}
                  onChange={handleFieldChange('id_especialidad')}
                  disabled={isLoading}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <option value="">Seleccionar...</option>
                  {especialidades && especialidades.map((esp) => (
                    <option key={esp.id_especialidad} value={esp.id_especialidad}>
                      {esp.descripcion} {/* <-- 🛠️ CORREGIDO: Llamamos a .descripcion y no al objeto completo */}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rol */}
            <div className="space-y-1">
              <label htmlFor="rol" className="block text-xs font-medium text-gray-700">Rol</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                </div>
                <select
                  id="rol"
                  value={formData.id_rol}
                  onChange={handleFieldChange('id_rol')}
                  disabled={isLoading}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <option value="">Seleccionar...</option>
                  {roles && roles.map((r) => (
                    <option key={r.id_rol} value={r.id_rol}>
                      {r.nombre_rol} {/* <-- 🛠️ CORREGIDO: Llamamos a .nombre_rol */}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Footer con botones */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium rounded-xl hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-sm bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-cyan-200 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Guardando...</span>
                </>
              ) : (
                <span>Guardar Profesional</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}