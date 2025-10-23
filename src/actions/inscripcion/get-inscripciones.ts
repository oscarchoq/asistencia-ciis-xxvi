"use server";

import prisma from "@/lib/prisma";

export const getInscripciones = async () => {
  try {
    const inscripciones = await prisma.inscripcion.findMany();
    
    return {
      ok: true,
      inscripciones: inscripciones,
    }
  } catch (error) {
      console.log(error)
      return {
        ok: false,
        error: "Failed to fetch planes"
      }
  }
}