import { useState, useEffect } from 'react';
import { catalogosService } from '../services/catalogosService';

export function useCatalogos() {
  const [especialidades, setEspecialidades] = useState([]);
  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      setCargando(true);
      try {
        const [esp, rol] = await Promise.all([
          catalogosService.obtenerEspecialidades(),
          catalogosService.obtenerRoles(),
        ]);
        setEspecialidades(esp);
        setRoles(rol);
      } catch (err) {
        console.error(err);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  return { especialidades, roles, cargando };
}
