import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export default function FeedbackAsignacion({ feedback }) {
  if (!feedback?.tipo) return null;

  if (feedback.tipo === 'success') {
    return (
      <div className="flex items-start gap-3 p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-sm font-medium">
        {feedback.texto}
      </div>
    );
  }

  const requiereAsignacionManual =
    feedback.texto?.toLowerCase().includes(
      'no hay suficientes profesionales'
    );

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50">
      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />

      <div>
        <p className="text-sm font-semibold text-red-700">
          Asignación fallida
        </p>

        <p className="text-sm text-red-600 mt-0.5">
          {feedback.texto}
        </p>

        {requiereAsignacionManual && (
          <div className="mt-3">
            <p className="text-sm text-red-700 mb-2">
              Puede continuar el proceso mediante asignación manual.
            </p>

            <Link
              to="/admin/asignacion-manual"
              className="inline-flex items-center rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 transition-colors"
            >
              Ir a Asignación Manual
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}