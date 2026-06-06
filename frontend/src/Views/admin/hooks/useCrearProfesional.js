import { useState } from 'react';
import { personalService } from '../services/personalService';

const FORM_INICIAL = {
  nombre: '',
  apellido: '',
  email: '',
  contrasena: '',
  id_especialidad: '',
  id_rol: '',
};

export function useCrearProfesional({ onSuccess } = {}) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState('');
  const [formData, setFormData] = useState(FORM_INICIAL);

  const abrirModal = () => setModalAbierto(true);

  const cerrarModal = () => {
    setModalAbierto(false);
    setErrorModal('');
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
      !formData.contrasena.trim() ||
      !formData.id_especialidad ||
      !formData.id_rol
    ) {
      setErrorModal('❌ Todos los campos son obligatorios.');
      setIsLoading(false);
      return;
    }

    try {
      const { response, data } = await personalService.registrar({
        ...formData,
        id_especialidad: Number(formData.id_especialidad),
        id_rol: Number(formData.id_rol),
      });

      if (!response.ok) {
        throw new Error(data?.error || 'No se pudo guardar el profesional.');
      }

      setFormData(FORM_INICIAL);
      cerrarModal();
      if (onSuccess) await onSuccess();
    } catch (err) {
      console.error(err);
      setErrorModal(err.message || '❌ Error al intentar registrar.');
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
    },
  };
}
