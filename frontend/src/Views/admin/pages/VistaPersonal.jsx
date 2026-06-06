import { Users, LayoutGrid, AlertTriangle } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import TablaPersonal from '../components/TablaPersonal';
import ModalAgregarProfesional from '../components/ModalAgregarProfesional';
import { usePersonal } from '../hooks/usePersonal';
import { useCatalogos } from '../hooks/useCatalogos';
import { useCrearProfesional } from '../hooks/useCrearProfesional';

export default function VistaPersonal() {
  const { profesionales, cargandoLista, errorLista, recargar } = usePersonal();
  const { especialidades, roles } = useCatalogos();
  const { abrirModal, modalProps } = useCrearProfesional({ onSuccess: recargar });

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatsCard titulo="Profesionales" subtitulo="Activos" valor={profesionales.length} icono={Users} />
        <StatsCard
          titulo="Especialidades"
          subtitulo="Registradas"
          valor={especialidades.length || '—'}
          icono={LayoutGrid}
        />
        <StatsCard
          titulo="Solicitudes"
          subtitulo="Pendientes"
          valor="—"
          icono={AlertTriangle}
          variant="alerta"
        />
      </div>

      <TablaPersonal
        profesionales={profesionales}
        cargandoLista={cargandoLista}
        errorLista={errorLista}
        onAgregar={abrirModal}
      />

      <ModalAgregarProfesional
        {...modalProps}
        especialidades={especialidades}
        roles={roles}
      />
    </div>
  );
}
