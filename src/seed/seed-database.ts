import prisma from '../lib/prisma';
import { initialData } from './seedData';

async function main() {
  console.log("Seed database");

  await prisma.usuario.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.metodoPago.deleteMany();

  const { plan, metodoPago, users } = initialData;

  // 1. Usuarios
  await prisma.usuario.createMany({
    data: users
  })

  // 2. Crear plan
  const planData = plan.map(denominacion => ({ denominacion }));
  await prisma.plan.createManyAndReturn({
    data: planData
  });

  // 3. Crear metodos de pago
  const metodoPagoData = metodoPago.map(denominacion => ({ denominacion }));
  await prisma.metodoPago.createManyAndReturn({
    data: metodoPagoData
  });

  console.log("Seed database completed");
}

(() => {
  if (process.env.NODE_ENV === "production") return;
  main();
})();