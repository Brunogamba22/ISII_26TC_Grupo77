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

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-red-200 bg-red-50">
      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-red-700">Asignación fallida</p>
        <p className="text-sm text-red-600 mt-0.5">{feedback.texto}</p>
      </div>
    </div>
  );
}
