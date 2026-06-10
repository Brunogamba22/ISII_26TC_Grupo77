const request = require('supertest');
const express = require('express');
const db = require('../models/db');
const { confirmarAsignacion, previsualizarAsignacion } = require('./guardiaController');

// Mocks para Transacciones ACID
const mockConnection = {
  query: jest.fn(),
  beginTransaction: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn(),
  release: jest.fn()
};

jest.mock('../models/db', () => ({
  getConnection: jest.fn(),
  query: jest.fn()
}));

const app = express();
app.use(express.json());
app.post('/api/asignacion', confirmarAsignacion);
app.post('/api/asignacion/previsualizar', previsualizarAsignacion);

describe('QA Testing - Asignación Automática de Guardias (guardiaController)', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    db.getConnection.mockResolvedValue(mockConnection);
    // Reiniciamos los mocks de la conexión para evitar estados residuales
    mockConnection.query.mockReset();
    mockConnection.beginTransaction.mockReset();
    mockConnection.commit.mockReset();
    mockConnection.rollback.mockReset();
    mockConnection.release.mockReset();
  });

  it('Camino Feliz: Inserta guardias y ejecuta COMMIT (Transacción Exitosa) - Retorna HTTP 200', async () => {
    // 1. SELECT validar duplicados
    mockConnection.query.mockResolvedValueOnce([[]]);
    // 2. INSERT calendario
    mockConnection.query.mockResolvedValueOnce([{ insertId: 1 }]);
    // 3. SELECT profesionales (Mínimo 2 requeridos)
    mockConnection.query.mockResolvedValueOnce([[{ id_usuario: 1 }, { id_usuario: 2 }]]);
    // 4. INSERT guardias (2 iteraciones basadas en el payload)
    mockConnection.query.mockResolvedValueOnce([{ insertId: 10 }]);
    mockConnection.query.mockResolvedValueOnce([{ insertId: 11 }]);

    const payload = {
      mes: 7,
      anio: 2026,
      id_especialidad: 2,
      reglas: { maxConsecutivas: 1 },
      turnos: [{ dia: 1, id_usuario: 1 }, { dia: 2, id_usuario: 2 }],
      horaInicio: "08:00",
      horaFin: "20:00"
    };

    const res = await request(app).post('/api/asignacion').send(payload);

    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBe("Cronograma guardado correctamente.");
    
    // Aserciones ACID
    expect(mockConnection.beginTransaction).toHaveBeenCalledTimes(1);
    expect(mockConnection.commit).toHaveBeenCalledTimes(1);
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });

  it('Excepción: Conflicto de Calendario Existente ejecuta ROLLBACK - Retorna HTTP 400', async () => {
    // 1. SELECT validar duplicados: Encuentra calendario existente
    mockConnection.query.mockResolvedValueOnce([[{ id_calendario: 5 }]]);

    const payload = {
      mes: 7, anio: 2026, id_especialidad: 2, turnos: [{ dia: 1, id_usuario: 1 }]
    };
    const res = await request(app).post('/api/asignacion').send(payload);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Ya existe un cronograma generado para ese mes y año.");
    
    // Aserciones ACID (No se debe iniciar transacción según contrato)
    expect(mockConnection.beginTransaction).not.toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });

  it('Excepción: Falta de parámetros - Retorna HTTP 400', async () => {
    const payload = { mes: 7 }; // Faltan datos requeridos y turnos vacíos
    const res = await request(app).post('/api/asignacion').send(payload);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Faltan parámetros requeridos para la generación.");
    
    // No debe solicitar conexión si falla validación estática inicial
    // Sin embargo, si la validación está dentro, dependerá. En el código actual falla antes de getConnection.
  });

  it('Excepción: Déficit de Recursos (Faltan Profesionales) ejecuta ROLLBACK - Retorna HTTP 400', async () => {
    // 1. SELECT validar duplicados
    mockConnection.query.mockResolvedValueOnce([[]]); 
    // 2. INSERT calendario
    mockConnection.query.mockResolvedValueOnce([{ insertId: 1 }]); 
    // 3. SELECT profesionales: Retorna solo 1 profesional
    mockConnection.query.mockResolvedValueOnce([[{ id_usuario: 1 }]]);

    const payload = {
      mes: 7, anio: 2026, id_especialidad: 2, turnos: [{ dia: 1, id_usuario: 1 }]
    };
    const res = await request(app).post('/api/asignacion').send(payload);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("No hay suficientes profesionales para generar las guardias");
    
    // Aserciones ACID
    expect(mockConnection.beginTransaction).toHaveBeenCalledTimes(1);
    expect(mockConnection.rollback).toHaveBeenCalledTimes(1);
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });

  it('Excepción: Fallo en Base de Datos dispara el Catch y ejecuta ROLLBACK - Retorna HTTP 500', async () => {
    // 1. SELECT validar duplicados
    mockConnection.query.mockResolvedValueOnce([[]]);
    // 2. Error inyectado simulando caída de la BD
    mockConnection.query.mockRejectedValueOnce(new Error("Conexión perdida")); 

    const payload = {
      mes: 7, anio: 2026, id_especialidad: 2, turnos: [{ dia: 1, id_usuario: 1 }]
    };
    const res = await request(app).post('/api/asignacion').send(payload);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Error interno del servidor al generar las guardias.");
    
    // Aserciones ACID
    expect(mockConnection.beginTransaction).toHaveBeenCalledTimes(1);
    expect(mockConnection.rollback).toHaveBeenCalledTimes(1);
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });
});

describe('QA Testing - Previsualizar Asignación de Guardias (guardiaController)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Camino Feliz: Genera previsualización exitosa en memoria (BORRADOR) - Retorna HTTP 200', async () => {
    // Mock SELECT de profesionales
    db.query.mockResolvedValueOnce([[{ id_usuario: 1, nombre: 'Ana', apellido: 'Perez' }, { id_usuario: 2, nombre: 'Luis', apellido: 'Gomez' }]]);

    const payload = {
      mes: 7, anio: 2026, id_especialidad: 2, horaInicio: "08:00", horaFin: "20:00"
    };

    const res = await request(app).post('/api/asignacion/previsualizar').send(payload);

    expect(res.status).toBe(200);
    expect(res.body.borrador).toBe(true);
    expect(res.body.turnos[0].estado).toBe('BORRADOR');
    expect(res.body.turnos.length).toBeGreaterThan(0);
    // Verificamos ausencia de persistencia: DB fue consultada solo con SELECT
    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.getConnection).not.toHaveBeenCalled();
  });

  it('Excepción: Faltan parámetros requeridos - Retorna HTTP 400', async () => {
    const payload = { mes: 7, anio: 2026 }; // Falta especialidad
    const res = await request(app).post('/api/asignacion/previsualizar').send(payload);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Faltan parámetros requeridos para la generación.");
    expect(db.query).not.toHaveBeenCalled();
  });

  it('Excepción: Déficit de recursos (menos de 2 profesionales) - Retorna HTTP 400', async () => {
    db.query.mockResolvedValueOnce([[{ id_usuario: 1, nombre: 'Ana', apellido: 'Perez' }]]); // Solo 1 profesional
    const payload = {
      mes: 7, anio: 2026, id_especialidad: 2
    };

    const res = await request(app).post('/api/asignacion/previsualizar').send(payload);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("No hay suficientes profesionales para generar las guardias");
  });
});

