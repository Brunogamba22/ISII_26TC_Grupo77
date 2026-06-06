import { UserPlus, Pencil, Trash2 } from 'lucide-react';

export default function TablaPersonal({
  profesionales = [],
  cargandoLista = false,
  errorLista = '',
  onAgregar,
  onEditar,
  onEliminar,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-gray-600 font-medium">ABM de personal médico y especialidades</h2>
          <div className="w-full sm:w-auto flex justify-start sm:justify-end">
            <button
              onClick={onAgregar}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors font-medium shadow-sm whitespace-nowrap"
            >
              <UserPlus size={18} />
              <span>Agregar Profesional</span>
            </button>
          </div>
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
            {cargandoLista && (
              <tr>
                <td colSpan={5} className="py-8 px-5 text-center text-gray-500">
                  Cargando personal...
                </td>
              </tr>
            )}

            {!cargandoLista && errorLista && (
              <tr>
                <td colSpan={5} className="py-8 px-5 text-center text-red-500">
                  {errorLista}
                </td>
              </tr>
            )}

            {!cargandoLista && !errorLista && profesionales.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 px-5 text-center text-gray-500">
                  No hay profesionales registrados.
                </td>
              </tr>
            )}

            {!cargandoLista &&
              !errorLista &&
              profesionales.map((profesional, index) => (
                <tr
                  key={profesional.id_usuario}
                  className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    index % 2 === 1 ? 'bg-gray-50/50' : ''
                  }`}
                >
                  <td className="py-4 px-5 text-gray-600">{profesional.id_usuario}</td>
                  <td className="py-4 px-5 text-cyan-600 font-medium">
                    {profesional.nombre} {profesional.apellido}
                  </td>
                  <td className="py-4 px-5">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        index === 1 ? 'bg-cyan-100 text-cyan-700' : 'text-gray-600'
                      }`}
                    >
                      {profesional.tipoEspecialidad}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-gray-600">{profesional.rol}</td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onEditar?.(profesional)}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 transition-colors"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => onEliminar?.(profesional)}
                        className="inline-flex items-center justify-center p-2 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
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
  );
}
