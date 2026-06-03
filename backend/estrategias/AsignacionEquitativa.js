/**
 * Estrategia Concreta: Asignación Equitativa
 * Garantiza la distribución equitativa de turnos y evita guardias consecutivas.
 */
class AsignacionEquitativa {
    
    asignarTurnos(profesionales, diasDelMes) {
        // Validación de seguridad crítica
        if (!profesionales || profesionales.length < 2) {
            throw new Error("No hay suficientes profesionales para generar las guardias sin repetir días consecutivos.");
        }

        // Mapa para llevar el conteo de cuántos turnos tiene cada profesional
        const conteoTurnos = {};
        profesionales.forEach(prof => {
            // Asumimos que los objetos 'profesionales' tienen un identificador único 'id_usuario'
            conteoTurnos[prof.id_usuario] = 0; 
        });

        const calendarioAsignado = [];
        let idUltimoAsignado = null;

        for (let dia = 1; dia <= diasDelMes; dia++) {
            // 1. Filtrar a los profesionales elegibles (que no trabajaron el día anterior)
            const elegibles = profesionales.filter(prof => prof.id_usuario !== idUltimoAsignado);

            // 2. Ordenar a los elegibles por la cantidad de turnos asignados (de menor a mayor)
            // Esto garantiza la equidad a lo largo del mes.
            elegibles.sort((a, b) => conteoTurnos[a.id_usuario] - conteoTurnos[b.id_usuario]);

            // 3. Seleccionar al profesional con menos turnos de la lista de elegibles
            const elegido = elegibles[0];

            // 4. Registrar el turno
            calendarioAsignado.push({
                dia: dia,
                id_usuario: elegido.id_usuario,
                nombre_profesional: `${elegido.nombre} ${elegido.apellido}`
            });

            // 5. Actualizar el estado para la siguiente iteración (día)
            conteoTurnos[elegido.id_usuario]++;
            idUltimoAsignado = elegido.id_usuario;
        }

        return calendarioAsignado;
    }
}

module.exports = AsignacionEquitativa;