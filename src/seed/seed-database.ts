import prisma from '../lib/prisma';
import { initialData } from './seedData';

async function main() {
  console.log("Seed database");

  await prisma.asistencia.deleteMany();
  await prisma.kit.deleteMany();
  await prisma.inscripcion.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.usuario.deleteMany();

  const { users, inscripciones } = initialData;

  // 1. Usuarios
  await prisma.usuario.createMany({
    data: users
  })

  // 2. Inscripciones
  await prisma.inscripcion.createMany({
    data: inscripciones
  })

  console.log("Seed database completed");
}

(() => {
  if (process.env.NODE_ENV === "production") return;
  main();
})();