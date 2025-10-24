"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const marcarAsistencia = async (numeroDocumento: string) => {
  try {
    // Verificar que el usuario esté autenticado

    console.log("Intentando marcar asistencia para documento:", numeroDocumento); // Debug
    const session = await auth();
    if (!session?.user?.id_usuario) {
      return {
        ok: false,
        message: "Debe iniciar sesión para marcar asistencia",
      };
    }

    // Validar que el número de documento no esté vacío
    if (!numeroDocumento.trim()) {
      return {
        ok: false,
        message: "Debe proporcionar un número de documento válido",
      };
    }

    // Buscar la inscripción por número de documento
    const inscripcion = await prisma.inscripcion.findUnique({
      where: {
        numero_documento: numeroDocumento.trim(),
      },
    });

    if (!inscripcion) {
      return {
        ok: false,
        message: `No se encontró ninguna inscripción con el documento: ${numeroDocumento}`,
      };
    }

    // Verificar que el pago esté validado
    if (!inscripcion.pago_validado) {
      return {
        ok: false,
        message: `El pago de ${inscripcion.nombres} ${inscripcion.apellidos} aún no ha sido validado`,
      };
    }

    // Buscar el evento activo del día actual
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const eventoActivo = await prisma.evento.findFirst({
      where: {
        activo: true,
        fecha_evento: hoy,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!eventoActivo) {
      return {
        ok: false,
        message: "No hay ningún evento activo para el día de hoy",
      };
    }

    // Verificar si ya marcó asistencia para este evento
    const asistenciaExistente = await prisma.asistencia.findUnique({
      where: {
        id_inscripcion_id_evento: {
          id_inscripcion: inscripcion.id_inscripcion,
          id_evento: eventoActivo.id_evento,
        },
      },
    });

    if (asistenciaExistente) {
      return {
        ok: false,
        message: `${inscripcion.nombres} ${inscripcion.apellidos} ya marcó asistencia para este evento`,
      };
    }

    // Registrar la asistencia
    await prisma.asistencia.create({
      data: {
        id_inscripcion: inscripcion.id_inscripcion,
        id_evento: eventoActivo.id_evento,
        id_usuario: session.user.id_usuario!,
        fecha_asistencia: new Date(),
        hora_asistencia: new Date(),
        activo: true,
      },
    });

    return {
      ok: true,
      message: `✅ Asistencia marcada exitosamente para ${inscripcion.nombres} ${inscripcion.apellidos}`,
    };
  } catch (error) {
    console.error("Error al marcar asistencia:", error);
    return {
      ok: false,
      message: "Error interno al marcar la asistencia. Por favor, intente nuevamente.",
    };
  }
};