import { useState, useEffect, useCallback } from 'react';
import { Users, LayoutGrid, AlertTriangle, UserPlus, Pencil, Trash2 } from 'lucide-react';
import ModalAgregarProfesional from './ModalAgregarProfesional';  
import { apiRequest } from '../../apiClient';

// Componente de Vista Personal
export default function VistaPersonal() {
  // 1. Estado para controlar la visibilidad del modal
  const [modalAbierto, setModalAbierto] = useState(false);

  // 2. Estados para cargar las opciones desde la Base de Datos real
  const [especialidades, setEspecialidades] = useState([]);
  const [roles, setRoles] = useState([]);

  // 3. Estado de la data que se va a enviar en el formulario (Estandarizado en Español)
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '', // Queda consistente en español
    id_especialidad: '',
    id_rol: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState('');
  const [profesionales, setProfesionales] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [errorLista, setErrorLista] = useState('');

  const cargarPersonal = useCallback(async () => {
    setCargandoLista(true);
    setErrorLista('');

    try {
      const { response, data } = await apiRequest('/personal', { method: 'GET' });

      if (!response.ok) {
        setErrorLista(data?.error || 'No se pudo cargar el listado de personal.');
        setProfesionales([]);
        return;
      }

      setProfesionales(data?.personal ?? []);
    } catch (err) {
      console.error(err);
      setErrorLista('Error de conexión al cargar el personal.');
      setProfesionales([]);
    } finally {
      setCargandoLista(false);
    }
  }, []);

  // Cargar Especialidades y Roles desde la base de datos al montar la vista
  useEffect(() => {
    const cargarParametros = async () => {
      try {
        // Descomentar cuando Jonathan tenga listos los GET de la base de datos:
        // const espData = await apiRequest("/especialidades", { method: "GET" });
        // const rolData = await apiRequest("/roles", { method: "GET" });
        // setEspecialidades(espData.data);
        // setRoles(rolData.data);

        // Datos cableados idénticos a tus llaves foráneas relacionales para testear la UI:
        setEspecialidades([
          { id_especialidad: 1, descripcion: 'Pediatría' },
          { id_especialidad: 2, descripcion: 'Cardiología' },
          { id_especialidad: 3, descripcion: 'Neurología' },
          { id_especialidad: 4, descripcion: 'Traumatología' },
          { id_especialidad: 5, descripcion: 'Medicina General' }
        ]);
        setRoles([
          { id_rol: 1, nombre_rol: 'Administrador' },
          { id_rol: 2, nombre_rol: 'Profesional' },
          { id_rol: 3, nombre_rol: 'Editor' }
        ]);
      } catch (err) {
        console.error("Error cargando parámetros iniciales:", err);
      }
    };
    cargarParametros();
    cargarPersonal();
  }, [cargarPersonal]);

  // 4. Función manejadora de cambios en cada input del modal
  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // 5. Función que gestiona el envío final (Contrato de operación de Registro contra MySQL)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorModal('');
    setIsLoading(true);

    // Validación de precondiciones locales (Cursos Alternativos del CU)
    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.email.trim() || !formData.contrasena.trim() || !formData.id_especialidad || !formData.id_rol) {
      setErrorModal('❌ Todos los campos son obligatorios.');
      setIsLoading(false);
      return;
    }

    try {
      // Envío directo al endpoint del backend Express (/api/registro)
      const { response, data } = await apiRequest("/registro", {
        method: "POST",
        body: {
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          contrasena: formData.contrasena, // Coincide Frontend con Parámetro de API Backend
          id_especialidad: Number(formData.id_especialidad),
          id_rol: Number(formData.id_rol)
        }
      });

      if (!response.ok) {
        setErrorModal(data?.error || '❌ No se pudo guardar el profesional.');
        return;
      }

      setFormData({ nombre: '', apellido: '', email: '', contrasena: '', id_especialidad: '', id_rol: '' });
      setModalAbierto(false);
      await cargarPersonal();

    } catch (err) {
      console.error(err);
      setErrorModal('❌ Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Profesionales</p>
              <p className="text-gray-500 text-sm">Activos</p>
              <p className="text-4xl font-bold text-gray-800 mt-2">{profesionales.length}</p>
            </div>
            <div className="text-cyan-500">
              <Users size={28} />
            </div>
          </div>
        </div>

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
        {/* Encabezado Único de Tabla */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-gray-600 font-medium">
              ABM de personal médico y especialidades
            </h2>
            {/* Contenedor de alineación para que el botón NO se estire */}
            <div className="w-full sm:w-auto flex justify-start sm:justify-end">
              <button
                onClick={() => setModalAbierto(true)}
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

              {!cargandoLista && !errorLista && profesionales.map((profesional, index) => (
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
                    <span className={`px-3 py-1 rounded-full text-sm ${index === 1 ? 'bg-cyan-100 text-cyan-700' : 'text-gray-600'}`}>
                      {profesional.tipoEspecialidad}
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

      {/* Modal Inyectado de manera Limpia */}
      <ModalAgregarProfesional
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
        formData={formData}
        onFieldChange={handleFieldChange}
        especialidades={especialidades}
        roles={roles}
        error={errorModal}
      />
    </div>
  );
}