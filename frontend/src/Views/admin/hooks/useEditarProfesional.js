import { useState, useEffect } from 'react';
import { personalService } from '../services/personalService';

export function useEditarProfesional({ onSuccess } = {}) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState('');
  
  // Guardamos el ID del usuario que estamos editando
  const [idEditando, setIdEditando] = useState(null);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '', // opcional en edición
    id_especialidad: '',
    id_rol: '',
  });

  const abrirModal = (profesional) => {
    setIdEditando(profesional.id_usuario);
    
    // El profesional que viene de la lista no trae id_especialidad/id_rol directamente, 
    // trae los nombres. Pero para el formulario necesitamos los IDs.
    // Como no tenemos los IDs en la fila, lo ideal sería que obtenerPersonal traiga esos IDs.
    // Asumiremos que vamos a modificar obtenerPersonal para que devuelva id_especialidad e id_rol también.
    setFormData({
      nombre: profesional.nombre || '',
      apellido: profesional.apellido || '',
      email: profesional.email || '',
      contrasena: '',
      id_especialidad: profesional.id_especialidad || '',
      id_rol: profesional.id_rol || '',
    });
    
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setErrorModal('');
    setIdEditando(null);
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorModal('');

    if (
      !formData.nombre.trim() ||
      !formData.apellido.trim() ||
      !formData.email.trim() ||
      !formData.id_especialidad ||
      !formData.id_rol
    ) {
      setErrorModal('❌ Nombre, apellido, email, especialidad y rol son obligatorios.');
      setIsLoading(false);
      return;
    }

    try {
      const { response, data } = await personalService.editar(idEditando, {
        ...formData,
        id_especialidad: Number(formData.id_especialidad),
        id_rol: Number(formData.id_rol),
      });

      if (!response.ok) {
        throw new Error(data?.error || 'No se pudo actualizar el profesional.');
      }

      cerrarModal();
      if (onSuccess) await onSuccess();
    } catch (err) {
      console.error(err);
      setErrorModal(err.message || '❌ Error al intentar actualizar.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    abrirModal,
    cerrarModal,
    modalProps: {
      isOpen: modalAbierto,
      onClose: cerrarModal,
      onSubmit: handleFormSubmit,
      isLoading,
      formData,
      onFieldChange: handleFieldChange,
      error: errorModal,
      isEdit: true, // flag para saber que estamos editando
    },
  };
}
