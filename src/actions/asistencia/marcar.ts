"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { decryptBase64 } from "@/lib/base64-util";
import { getPeruDateTime, extractTimeLocal } from "@/lib/date-util";
import { revalidatePath } from "next/cache";

export const marcarAsistencia = async (codigoODocumento: string) => {
  try {
    // Verificar que el usuario esté autenticado
    const session = await auth();
    if (!session?.user?.id_usuario) {
      return {
        ok: false,
        message: "No autorizado - Debe iniciar sesión",
      };
    }

    // Validar que el código no esté vacío
    if (!codigoODocumento.trim()) {
      return {
        ok: false,
        message: "Debe proporcionar un código válido",
      };
    }

    // Desencriptar el código (viene encriptado tanto del QR como del manual)
    let numeroDocumento: string;
    try {
      numeroDocumento = decryptBase64(codigoODocumento.trim());
      console.log("Código desencriptado:", numeroDocumento); // Debug
    } catch (error) {
      console.error("Error al desencriptar:", error);
      return {
        ok: false,
        message: "Código inválido o corrupto",
      };
    }

    // Buscar la inscripción por número de documento
    const inscripcion = await prisma.inscripcion.findUnique({
      where: {
        numero_documento: numeroDocumento,
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

    console.log("DEBUG");
    console.log(getPeruDateTime());

    const eventoEnCurso = await prisma.evento.findFirst({
      where: {
        activo: true,
        fecha_evento: getPeruDateTime(),
        hora_inicio: { lte: getPeruDateTime() },
        hora_fin: { gte: getPeruDateTime() },
      }
    })

    console.log(eventoEnCurso)

    // SI NO HAY EVENTO EN CURSO, BUSCAMOS EL PROXIMO EVENTO
    if (!eventoEnCurso) {
      // Buscamos el proximo evento del día
      const proximoEvento = await prisma.evento.findFirst({
        where: {
          activo: true,
          fecha_evento: getPeruDateTime(),
          hora_inicio: { gt: getPeruDateTime() },
        },
        orderBy: {
          hora_inicio: 'asc'
        }
      })

      console.log(proximoEvento)

      if (proximoEvento) {
        return {
          ok: false,
          message: `No hay eventos en curso. Próximo: "${proximoEvento.denominacion}" - ${extractTimeLocal(proximoEvento.hora_inicio)}`,
        };
      }

      return {
        ok: false,
        message: "No hay eventos en curso en este momento. Todos los eventos del día han finalizado.",
      };
    }

    // Verificar si ya marcó asistencia para este evento
    const asistenciaExistente = await prisma.asistencia.findUnique({
      where: {
        id_inscripcion_id_evento: {
          id_inscripcion: inscripcion.id_inscripcion,
          id_evento: eventoEnCurso.id_evento,
        },
      },
    });

    if (asistenciaExistente) {
      return {
        ok: false,
        message: `${inscripcion.nombres} ${inscripcion.apellidos} ya marcó asistencia para el evento "${eventoEnCurso.denominacion}"`,
      };
    }

    // Registrar la asistencia con fecha y hora de Perú
    await prisma.asistencia.create({
      data: {
        id_inscripcion: inscripcion.id_inscripcion,
        id_evento: eventoEnCurso.id_evento,
        id_usuario: session.user.id_usuario!,
      },
    });

    // Invalidar caché de asistencias
    revalidatePath('/asistencia/listar', 'page');
    revalidatePath('/', 'page');

    return {
      ok: true,
      message: `${inscripcion.nombres} ${inscripcion.apellidos}</br>Evento: ${eventoEnCurso.denominacion}`,
    };
  } catch (error) {
    console.error("Error al marcar asistencia:", error);
    return {
      ok: false,
      message: "Error interno al marcar la asistencia. Por favor, intente nuevamente.",
    };
  }
};