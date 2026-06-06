import { Users, Stethoscope, Calendar, ClipboardCheck, Settings } from 'lucide-react';

export const adminMenuItems = [
  { id: 'personal', path: 'personal', label: 'Personal', icon: Users },
  { id: 'especialidades', path: 'especialidades', label: 'Especialidades', icon: Stethoscope },
  { id: 'calendario', path: 'calendario', label: 'Calendario', icon: Calendar },
  { id: 'aprobaciones', path: 'aprobaciones', label: 'Aprobaciones', icon: ClipboardCheck },
  { id: 'asignacion', path: 'asignacion', label: 'Asignación Automática', icon: Settings },
];
