class MotorDeAsignacion {
    constructor(estrategia) {
        this.estrategia = estrategia;
    }

    setEstrategia(nuevaEstrategia) {
        this.estrategia = nuevaEstrategia;
    }

    ejecutar(profesionales, diasDelMes, reglas = {}) {
        if (!this.estrategia) {
            throw new Error("Estrategia de asignación no definida.");
        }

        return this.estrategia.asignarTurnos(
            profesionales,
            diasDelMes,
            reglas
        );
    }
}

module.exports = MotorDeAsignacion;