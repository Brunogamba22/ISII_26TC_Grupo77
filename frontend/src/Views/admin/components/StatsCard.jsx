export default function StatsCard({ titulo, subtitulo, valor, icono: Icon, variant = 'normal' }) {
  const esAlerta = variant === 'alerta';

  return (
    <div
      className={`rounded-2xl p-5 shadow-sm border ${
        esAlerta ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${esAlerta ? 'text-red-400' : 'text-gray-500'}`}>
            {titulo}
          </p>
          <p className={`text-sm ${esAlerta ? 'text-red-400' : 'text-gray-500'}`}>{subtitulo}</p>
          <p className={`text-4xl font-bold mt-2 ${esAlerta ? 'text-red-500' : 'text-gray-800'}`}>
            {valor}
          </p>
        </div>
        <div className={esAlerta ? 'text-red-400' : 'text-cyan-500'}>
          <Icon size={28} />
        </div>
      </div>
    </div>
  );
}
