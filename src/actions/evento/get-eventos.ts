"use server";

import prisma from "@/lib/prisma";

export const getEventos = async () => {
  try {
    const eventos = await prisma.evento.findMany({
      orderBy: {
        fecha_evento: "desc",
      },
    });

    return {
      ok: true,
      eventos,
    };
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    return {
      ok: false,
      error: "Error al obtener eventos",
    };
  }
};
