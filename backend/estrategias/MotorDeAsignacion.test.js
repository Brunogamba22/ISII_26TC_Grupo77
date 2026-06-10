const MotorDeAsignacion = require('./MotorDeAsignacion');

describe('QA Testing - Patrón Strategy: Contexto (MotorDeAsignacion)', () => {

  // TC-01: Instanciar el motor pasando null o sin estrategia. Verificar Error.
  it('TC-01 (Excepción): Lanzar error al ejecutar sin estrategia definida', () => {
    // Instanciamos el motor pasando null (sin estrategia)
    const motor = new MotorDeAsignacion(null);
    
    // Verificamos que lance estrictamente el error esperado
    expect(() => {
      motor.ejecutar([], 30, {});
    }).toThrow("Estrategia de asignación no definida.");
  });

  // TC-02: Delegación exitosa. Inyectar mock y verificar pase de parámetros.
  it('TC-02 (Delegación exitosa): El motor delega la tarea a la estrategia inyectada con los parámetros exactos', () => {
    // Creamos el Mock de la estrategia con un método asignarTurnos falso
    const mockEstrategia = {
      asignarTurnos: jest.fn().mockReturnValue([{ dia: 1, id_usuario: 1 }])
    };

    // Inyectamos el mock en el constructor del Motor
    const motor = new MotorDeAsignacion(mockEstrategia);
    
    // Definimos parámetros de prueba
    const profesionales = [{ id_usuario: 1 }, { id_usuario: 2 }];
    const diasDelMes = 31;
    const reglas = { maxGuardias: 5 };

    // Ejecutamos la acción en el Contexto
    const resultado = motor.ejecutar(profesionales, diasDelMes, reglas);

    // Aserciones de Jest
    expect(mockEstrategia.asignarTurnos).toHaveBeenCalledTimes(1);
    expect(mockEstrategia.asignarTurnos).toHaveBeenCalledWith(profesionales, diasDelMes, reglas);
    expect(resultado).toEqual([{ dia: 1, id_usuario: 1 }]);
  });

  // TC-03: Cambio de estado dinámico usando setEstrategia.
  it('TC-03 (Cambio de estado dinámico): Modificar estrategia en tiempo de ejecución', () => {
    // Creamos dos Mocks distintos para comprobar el polimorfismo
    const mockEstrategiaInicial = {
      asignarTurnos: jest.fn().mockReturnValue('Resultado Inicial')
    };
    
    const mockNuevaEstrategia = {
      asignarTurnos: jest.fn().mockReturnValue('Resultado Nuevo')
    };

    // Instanciamos con el mock inicial
    const motor = new MotorDeAsignacion(mockEstrategiaInicial);
    
    // Usamos el setter para inyectar la nueva estrategia dinámicamente
    motor.setEstrategia(mockNuevaEstrategia);
    
    // Ejecutamos
    const resultado = motor.ejecutar([], 30, {});

    // Aserciones: Garantizamos que respondió la NUEVA estrategia y no la vieja
    expect(mockEstrategiaInicial.asignarTurnos).not.toHaveBeenCalled();
    expect(mockNuevaEstrategia.asignarTurnos).toHaveBeenCalledTimes(1);
    expect(resultado).toBe('Resultado Nuevo');
  });

});
