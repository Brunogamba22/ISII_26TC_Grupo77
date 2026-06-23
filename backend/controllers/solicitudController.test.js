const request = require('supertest');
const express = require('express');
const db = require('../models/db');
const { crearSolicitudDeCambio } = require('./solicitudController');

// Mocks para Transacciones ACID
const mockConnection = {
  query: jest.fn(),
  beginTransaction: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn(),
  release: jest.fn()
};

// Mockear el módulo de Base de Datos
jest.mock('../models/db', () => ({
  query: jest.fn(),
  getConnection: jest.fn()
}));

// Setup de app Express mínima para Supertest
const app = express();
app.use(express.json());
app.post('/api/solicitudes', crearSolicitudDeCambio);

describe('QA Testing - Solicitud de Cambio de Guardia (solicitudController)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    db.getConnection.mockResolvedValue(mockConnection);
    mockConnection.query.mockReset();
    mockConnection.beginTransaction.mockReset();
    mockConnection.commit.mockReset();
    mockConnection.rollback.mockReset();
    mockConnection.release.mockReset();
  });

  it('Camino Feliz: Crea solicitud correctamente y retorna HTTP 201', async () => {
    // 1. Mock: No existe solicitud pendiente
    db.query.mockResolvedValueOnce([[]]); 
    // 2. Mock: La guardia existe, es del usuario y está 'asignada'
    db.query.mockResolvedValueOnce([[{ id_guardia: 12, estado: 'asignada' }]]);
    // 3. Mock: CALL sp_crear_solicitud_cambio(?, ?, ?)
    mockConnection.query.mockResolvedValueOnce([[]]);

    const payload = {
      motivo: "Problema de salud urgente documentado",
      id_guardia: 12,
      id_usuario: 5
    };

    const res = await request(app).post('/api/solicitudes').send(payload);

    expect(res.status).toBe(201);
    expect(res.body.mensaje).toBe("Solicitud registrada correctamente");
    expect(db.query).toHaveBeenCalledTimes(2);
    expect(mockConnection.query).toHaveBeenCalledTimes(1);
    expect(mockConnection.beginTransaction).toHaveBeenCalledTimes(1);
    expect(mockConnection.commit).toHaveBeenCalledTimes(1);
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });

  it('Excepción: Falta de parámetros - Retorna HTTP 400', async () => {
    const payloadIncompleto = { id_usuario: 5 }; // Falta motivo y guardia
    const res = await request(app).post('/api/solicitudes').send(payloadIncompleto);
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Datos incompletos");
    expect(db.query).not.toHaveBeenCalled();
  });

  it('Excepción: Validación estricta de motivo (caracteres prohibidos) - Retorna HTTP 400', async () => {
    const payload = { 
      motivo: "Enfermedad grave <>{ }", // Caracteres prohibidos
      id_guardia: 12, 
      id_usuario: 5 
    };
    const res = await request(app).post('/api/solicitudes').send(payload);
    
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("El motivo ingresado no es válido");
    expect(db.query).not.toHaveBeenCalled();
  });

  it('Excepción: Guardia no perteneciente al usuario solicitante - Retorna HTTP 404', async () => {
    db.query.mockResolvedValueOnce([[]]); // No hay solicitudes previas
    db.query.mockResolvedValueOnce([[]]); // Guardia no encontrada para ese usuario

    const payload = { 
      motivo: "Problema de salud urgente documentado", 
      id_guardia: 99, 
      id_usuario: 5 
    };
    const res = await request(app).post('/api/solicitudes').send(payload);

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("La guardia no existe o no le pertenece");
  });

  it('Excepción: Conflicto de Estado, guardia ya tiene solicitud pendiente - Retorna HTTP 400', async () => {
    // La primera consulta detecta que ya hay una solicitud en estado 'pendiente'
    db.query.mockResolvedValueOnce([[{ id_reemplazo: 10, estado: 'pendiente' }]]);

    const payload = { 
      motivo: "Problema de salud urgente documentado", 
      id_guardia: 12, 
      id_usuario: 5 
    };
    const res = await request(app).post('/api/solicitudes').send(payload);

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Ya existe una solicitud pendiente para esta guardia");
  });

  it('Excepción: Error en la base de datos ejecuta ROLLBACK - Retorna HTTP 500', async () => {
    db.query.mockResolvedValueOnce([[]]); 
    db.query.mockResolvedValueOnce([[{ id_guardia: 12, estado: 'asignada' }]]);
    // Forzamos fallo durante la transacción (ej. inserción fallida)
    mockConnection.query.mockRejectedValueOnce(new Error("Conexión perdida"));

    const payload = { 
      motivo: "Problema de salud urgente documentado", 
      id_guardia: 12, 
      id_usuario: 5 
    };
    const res = await request(app).post('/api/solicitudes').send(payload);

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Error interno del servidor. Por favor, intente nuevamente más tarde");
    
    // Aserciones ACID
    expect(mockConnection.beginTransaction).toHaveBeenCalledTimes(1);
    expect(mockConnection.rollback).toHaveBeenCalledTimes(1);
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalledTimes(1);
  });
});
