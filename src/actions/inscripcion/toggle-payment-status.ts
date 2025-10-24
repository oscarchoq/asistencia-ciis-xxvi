"use server";

import prisma from "@/lib/prisma";

export const togglePaymentStatus = async (id_inscripcion: string) => {
  try {
    // Obtener la inscripción actual
    const inscripcion = await prisma.inscripcion.findUnique({
      where: {
        id_inscripcion,
      },
    });

    if (!inscripcion) {
      return {
        ok: false,
        error: "La inscripción no existe",
      };
    }

    // Cambiar el estado del pago
    const nuevoEstado = !inscripcion.pago_validado;
    
    const inscripcionActualizada = await prisma.inscripcion.update({
      where: {
        id_inscripcion,
      },
      data: {
        pago_validado: nuevoEstado,
        fecha_pago_validado: nuevoEstado ? new Date() : null,
      },
    });

    return {
      ok: true,
      inscripcion: inscripcionActualizada,
      message: nuevoEstado 
        ? "Pago validado exitosamente" 
        : "Pago marcado como pendiente",
    };
  } catch (error) {
    console.error("Error al cambiar estado de pago:", error);
    return {
      ok: false,
      error: "Error al cambiar el estado del pago",
    };
  }
};
