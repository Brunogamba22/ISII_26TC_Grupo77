

// Componente placeholder para otras vistas
export default function VistaPlaceholder({ titulo }) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{titulo}</h2>
          <p className="text-gray-500">Contenido del módulo {titulo}</p>
        </div>
      </div>
    );
  }