"use server";

import prisma from "@/lib/prisma";

export const getAsistencias = async () => {
  try {
    const asistencias = await prisma.asistencia.findMany({
      include: {
        inscripcion: true,
        evento: true,
        registrado_por: {
          select: {
            name: true,
            correo: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc", // Los últimos registros primero
      },
    });

    return {
      ok: true,
      asistencias,
    };
  } catch (error) {
    console.error("Error al obtener asistencias:", error);
    return {
      ok: false,
      error: "Error al obtener asistencias",
      asistencias: [],
    };
  }
};
