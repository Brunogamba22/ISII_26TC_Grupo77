const usuarios = [
  {
    id_usuario: 1,
    nombre: "Juan",
    apellido: "Pérez",
    email: "medico@hospital.com",
    contraseña: "123",
    id_rol: 2,
  },
];

const guardias = [
  {
    id_guardia: 1,
    fecha: 20260510,
    horario: 1400,
    id_usuario: 1,
    id_especialidad: 1,
    estado: "asignada",
  },
];

const reemplazos = [];

const sesionesActivas = [];

module.exports = { usuarios, guardias, reemplazos, sesionesActivas };
