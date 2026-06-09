/**
 * Genera dinámicamente el listado de meses utilizando la API nativa Intl.
 * Retorna un formato compatible con el backend de Express (numero: "1".."12").
 * * @param {string} locale Configuración regional (por defecto es-AR)
 * @returns {Array<{numero: string, nombre: string}>}
 */
export function obtenerOpcionesMeses(locale = 'es-AR') {
    const formatter = new Intl.DateTimeFormat(locale, { month: 'long' });
    
    return Array.from({ length: 12 }, (_, i) => {
      const numero = String(i + 1);
      // Usamos el año 2000 como referencia estática para iterar los 12 meses
      const nombreMesRaw = formatter.format(new Date(2000, i, 1));
      
      // Capitalizamos la primera letra ("enero" -> "Enero")
      const nombreCapitalizado = nombreMesRaw.charAt(0).toUpperCase() + nombreMesRaw.slice(1);
      
      return {
        numero,
        nombre: nombreCapitalizado
      };
    });
  }