"use server";

import prisma from "@/lib/prisma";
import { getPeruDateTime } from "@/lib/date-util";

export const getDashboardStats = async () => {
  try {
    
    const [
      totalInscritos,
      pagosValidados,
      kitsEntregados,
      asistenciasHoy,
    ] = await Promise.all([
      // Total de inscripciones
      prisma.inscripcion.count(),
      
      // Pagos validados
      prisma.inscripcion.count({
        where: { pago_validado: true }
      }),
      
      // Total de kits entregados
      prisma.kit.count({
        where: { entregado: true }
      }),
      
      // Asistencias registradas hoy
      prisma.asistencia.count({
        where: {
          fecha_asistencia: getPeruDateTime(),
        }
      }),
    ]);

    return {
      ok: true,
      stats: {
        totalInscritos,
        pagosValidados,
        kitsEntregados,
        asistenciasHoy,
      }
    };
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return {
      ok: false,
      error: "Error al obtener las estadísticas del dashboard"
    };
  }
};
