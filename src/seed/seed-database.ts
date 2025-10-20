import prisma from '../lib/prisma';
import { initialData } from './seedData';

async function main() {
  console.log("Seed database");

  await prisma.plan.deleteMany();
  await prisma.metodoPago.deleteMany();
  await prisma.rol.deleteMany();

  const { rol, plan, metodoPago } = initialData;

  // 1. Crear roles
  const rolData = rol.map(denominacion => ({ denominacion }));
  await prisma.rol.createManyAndReturn({
    data: rolData
  });

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