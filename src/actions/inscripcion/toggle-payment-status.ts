"use server";

import prisma from "@/lib/prisma";
import { sendEmailInscripcionIndividual } from "./send-email-individual";

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

    // Validar que no esté ya validado (no permitir revertir)
    if (inscripcion.pago_validado) {
      return {
        ok: false,
        error: "El pago ya fue validado y no se puede revertir",
      };
    }

    // Validar el pago
    const inscripcionActualizada = await prisma.inscripcion.update({
      where: {
        id_inscripcion,
      },
      data: {
        pago_validado: true,
        fecha_pago_validado: new Date(),
      },
    });

    // Enviar email de confirmación
    const emailResult = await sendEmailInscripcionIndividual(
      inscripcionActualizada,
      true
    );

    if (!emailResult.ok) {
      console.error("Error al enviar email:", emailResult.error);
      // El pago se validó pero el email falló
      return {
        ok: true,
        inscripcion: inscripcionActualizada,
        message:
          "Pago validado exitosamente, pero hubo un error al enviar el correo de confirmación",
        warning: emailResult.message,
      };
    }

    return {
      ok: true,
      inscripcion: inscripcionActualizada,
      message: "Pago validado y correo de confirmación enviado exitosamente",
    };
  } catch (error) {
    console.error("Error al validar pago:", error);
    return {
      ok: false,
      error: "Error al validar el pago",
    };
  }
};
