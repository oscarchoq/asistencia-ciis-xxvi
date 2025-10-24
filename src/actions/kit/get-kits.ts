"use server";

import prisma from "@/lib/prisma";

export const getKits = async () => {
  try {
    const kits = await prisma.kit.findMany({
      include: {
        inscripcion: true,
        entregado_por: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      ok: true,
      kits,
    };
  } catch (error) {
    console.error("Error al obtener kits:", error);
    return {
      ok: false,
      kits: [],
    };
  }
};
