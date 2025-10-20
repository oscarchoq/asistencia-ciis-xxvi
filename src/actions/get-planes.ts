"use server";

import prisma from "@/lib/prisma";

export const getPlanes = async () => {
  try {
    const planes = await prisma.plan.findMany({
      where: { activo: true },
    });
    
    return {
      ok: true,
      planes: planes,
    }
  } catch (error) {
      console.log(error)
      return {
        ok: false,
        error: "Failed to fetch planes"
      }
  }
}