"use server";

import prisma from "@/lib/prisma";

export const getUsuarios = async () => {
  try {
    const usuarios = await prisma.usuario.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      ok: true,
      usuarios,
    };
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return {
      ok: false,
      error: "Error al obtener usuarios",
    };
  }
};
