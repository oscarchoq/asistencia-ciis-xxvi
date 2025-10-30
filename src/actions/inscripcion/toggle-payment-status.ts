"use server";

import prisma from "@/lib/prisma";
import { sendEmailInscripcionIndividual } from "./send-email-individual";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth.config";

export const togglePaymentStatus = async (id_inscripcion: string) => {
  try {

    // Verificar que el usuario esté autenticado
    const session = await auth();
    if (!session?.user?.id_usuario) {
      return {
        ok: false,
        error: "No autorizado - Debe iniciar sesión",
      };
    }

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

    console.log(session.user.id_usuario)
    // Validar el pago
    const inscripcionActualizada = await prisma.inscripcion.update({
      where: {
        id_inscripcion,
      },
      data: {
        pago_validado: true,
        id_usuario: session.user.id_usuario,
      },
    });

    try {
      await prisma.$executeRaw`
        UPDATE "Inscripcion"
        SET "fecha_pago_validado" = NOW()
        WHERE "id_inscripcion" = ${id_inscripcion} AND "pago_validado" = true;
      `;
    } catch (error) {
      console.warn("Error ignorado al actualizar fecha_pago_validado:", error);
    }

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

    revalidatePath("/");
    revalidatePath("/inscripcion", 'page');

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
