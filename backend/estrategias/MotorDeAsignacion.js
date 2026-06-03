/**
 * Contexto: Motor de Asignación
 * Utiliza una estrategia inyectada para calcular los turnos.
 */
class MotorDeAsignacion {
    constructor(estrategia) {
        this.estrategia = estrategia;
    }

    // Permite cambiar la estrategia en tiempo de ejecución si fuera necesario
    setEstrategia(nuevaEstrategia) {
        this.estrategia = nuevaEstrategia;
    }

    // Delega la ejecución del algoritmo a la estrategia configurada
    ejecutar(profesionales, diasDelMes) {
        if (!this.estrategia) {
            throw new Error("Estrategia de asignación no definida.");
        }
        return this.estrategia.asignarTurnos(profesionales, diasDelMes);
    }
}

module.exports = MotorDeAsignacion;