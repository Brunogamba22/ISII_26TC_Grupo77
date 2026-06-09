import { useState, useEffect } from 'react';
import { catalogosService } from '../services/catalogosService';

export function useEspecialidades() {
  const [especialidades, setEspecialidades] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      setError('');
      try {
        const data = await catalogosService.obtenerEspecialidades();
        setEspecialidades(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las especialidades.');
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  return { especialidades, cargando, error };
}