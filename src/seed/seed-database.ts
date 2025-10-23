import prisma from '../lib/prisma';
import { initialData } from './seedData';

async function main() {
  console.log("Seed database");

  await prisma.usuario.deleteMany();
  await prisma.inscripcion.deleteMany();

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