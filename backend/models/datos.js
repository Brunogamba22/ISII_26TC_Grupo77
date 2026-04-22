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

let guardias = [
  { id_guardia: 1, fecha: 20260510, horario: 1400, id_usuario: 1, id_especialidad: 1, estado: "asignada" },
  { id_guardia: 2, fecha: 20260512, horario: 800, id_usuario: 1, id_especialidad: 1, estado: "asignada" },
  { id_guardia: 3, fecha: 20260515, horario: 2000, id_usuario: 1, id_especialidad: 1, estado: "asignada" }
];

const reemplazos = [];

const sesionesActivas = [];

module.exports = { usuarios, guardias, reemplazos, sesionesActivas };
