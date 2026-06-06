import { useState, useEffect, useCallback } from 'react';
import { personalService } from '../services/personalService';

export function usePersonal() {
  const [profesionales, setProfesionales] = useState([]);
  const [cargandoLista, setCargandoLista] = useState(true);
  const [errorLista, setErrorLista] = useState('');

  const recargar = useCallback(async () => {
    setCargandoLista(true);
    setErrorLista('');

    try {
      const { response, data } = await personalService.obtener();

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

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { profesionales, cargandoLista, errorLista, recargar };
}
