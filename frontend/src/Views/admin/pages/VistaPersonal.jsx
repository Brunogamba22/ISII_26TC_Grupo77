import { Users, LayoutGrid, AlertTriangle } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import TablaPersonal from '../components/TablaPersonal';
import ModalAgregarProfesional from '../components/ModalAgregarProfesional';
import { usePersonal } from '../hooks/usePersonal';
import { useCatalogos } from '../hooks/useCatalogos';
import { useCrearProfesional } from '../hooks/useCrearProfesional';
import { useEditarProfesional } from '../hooks/useEditarProfesional';
import { personalService } from '../services/personalService';

export default function VistaPersonal() {
  const { profesionales, cargandoLista, errorLista, recargar } = usePersonal();
  const { especialidades, roles } = useCatalogos();
  const { abrirModal: abrirModalCrear, modalProps: modalPropsCrear } = useCrearProfesional({ onSuccess: recargar });
  const { abrirModal: abrirModalEditar, modalProps: modalPropsEditar } = useEditarProfesional({ onSuccess: recargar });

  const handleEliminar = async (profesional) => {
    if (window.confirm(`¿Estás seguro que deseas dar de baja a ${profesional.nombre} ${profesional.apellido}?`)) {
      try {
        const { response, data } = await personalService.eliminar(profesional.id_usuario);
        if (!response.ok) throw new Error(data?.error || 'Error al eliminar');
        await recargar();
      } catch (error) {
        alert(error.message);
      }
    }
  };

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
        onAgregar={abrirModalCrear}
        onEditar={abrirModalEditar}
        onEliminar={handleEliminar}
      />

      {/* Modal para Crear */}
      <ModalAgregarProfesional
        {...modalPropsCrear}
        especialidades={especialidades}
        roles={roles}
      />

      {/* Modal para Editar */}
      <ModalAgregarProfesional
        {...modalPropsEditar}
        especialidades={especialidades}
        roles={roles}
      />
    </div>
  );
}
