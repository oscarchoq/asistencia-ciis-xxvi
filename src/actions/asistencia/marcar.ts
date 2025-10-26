"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { decryptBase64 } from "@/lib/base64-util";

export const marcarAsistencia = async (codigoODocumento: string) => {
  try {
    // Verificar que el usuario esté autenticado
    const session = await auth();
    if (!session?.user?.id_usuario) {
      return {
        ok: false,
        message: "Debe iniciar sesión para marcar asistencia",
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

    // Buscar eventos activos del día actual
    const ahora = new Date();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const mañana = new Date(hoy);
    mañana.setDate(mañana.getDate() + 1);

    const eventosDelDia = await prisma.evento.findMany({
      where: {
        activo: true,
        fecha_evento: {
          gte: hoy,
          lt: mañana,
        },
      },
      orderBy: {
        hora_inicio: 'asc',
      },
    });

    if (eventosDelDia.length === 0) {
      return {
        ok: false,
        message: "No hay ningún evento activo para el día de hoy",
      };
    }

    // Buscar el evento que está en curso según la hora actual
    const horaActual = ahora.getHours() * 60 + ahora.getMinutes(); // Convertir a minutos desde medianoche

    let eventoEnCurso = null;

    for (const evento of eventosDelDia) {
      const horaInicio = new Date(evento.hora_inicio);
      const horaFin = new Date(evento.hora_fin);
      
      const inicioMinutos = horaInicio.getHours() * 60 + horaInicio.getMinutes();
      const finMinutos = horaFin.getHours() * 60 + horaFin.getMinutes();

      // Verificar si la hora actual está dentro del rango del evento
      if (horaActual >= inicioMinutos && horaActual <= finMinutos) {
        eventoEnCurso = evento;
        break;
      }
    }

    if (!eventoEnCurso) {
      // Buscar el próximo evento
      const proximoEvento = eventosDelDia.find((evento) => {
        const horaInicio = new Date(evento.hora_inicio);
        const inicioMinutos = horaInicio.getHours() * 60 + horaInicio.getMinutes();
        return horaActual < inicioMinutos;
      });

      if (proximoEvento) {
        const horaInicio = new Date(proximoEvento.hora_inicio);
        return {
          ok: false,
          message: `No hay un evento en curso. El próximo evento "${proximoEvento.denominacion}" inicia a las ${horaInicio.toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
          })}`,
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

    // Registrar la asistencia
    await prisma.asistencia.create({
      data: {
        id_inscripcion: inscripcion.id_inscripcion,
        id_evento: eventoEnCurso.id_evento,
        id_usuario: session.user.id_usuario!,
        fecha_asistencia: new Date(),
        hora_asistencia: new Date(),
        activo: true,
      },
    });

    return {
      ok: true,
      message: `Se registró la asistencia de ${inscripcion.nombres} ${inscripcion.apellidos} en el evento "${eventoEnCurso.denominacion}"`,
    };
  } catch (error) {
    console.error("Error al marcar asistencia:", error);
    return {
      ok: false,
      message: "Error interno al marcar la asistencia. Por favor, intente nuevamente.",
    };
  }
};