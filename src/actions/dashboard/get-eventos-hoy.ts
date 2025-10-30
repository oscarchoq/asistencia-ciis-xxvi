"use server";

import prisma from "@/lib/prisma";
import { getPeruDateTime, getPeruTimeInMinutes } from "@/lib/date-util";

export const getEventosHoy = async () => {
  try {

    // Obtener eventos del día
    const eventos = await prisma.evento.findMany({
      where: {
        activo: true,
        fecha_evento: getPeruDateTime(),
      },
      orderBy: {
        hora_inicio: 'asc',
      },
      include: {
        _count: {
          select: {
            Asistencia: true
          }
        }
      }
    });

    // Determinar el estado de cada evento
    const horaActualMinutos = getPeruTimeInMinutes();

    const eventosConEstado = eventos.map(evento => {
      const horaInicio = new Date(evento.hora_inicio);
      const horaFin = new Date(evento.hora_fin);
      
      const inicioMinutos = horaInicio.getHours() * 60 + horaInicio.getMinutes();
      const finMinutos = horaFin.getHours() * 60 + horaFin.getMinutes();

      let estado: 'en_curso' | 'proximo' | 'finalizado';
      
      if (horaActualMinutos >= inicioMinutos && horaActualMinutos <= finMinutos) {
        estado = 'en_curso';
      } else if (horaActualMinutos < inicioMinutos) {
        estado = 'proximo';
      } else {
        estado = 'finalizado';
      }

      return {
        ...evento,
        estado,
        totalAsistencias: evento._count.Asistencia,
      };
    });

    return {
      ok: true,
      eventos: eventosConEstado,
    };
  } catch (error) {
    console.error("Error al obtener eventos de hoy:", error);
    return {
      ok: false,
      error: "Error al obtener los eventos del día",
      eventos: [],
    };
  }
};
