"use server";

import prisma from "@/lib/prisma";

interface UpdateEventoData {
  id_evento: string;
  denominacion: string;
  descripcion?: string;
  fecha_evento: Date;
  hora_inicio: Date;
  hora_fin: Date;
  activo: boolean;
}

export const updateEvento = async (data: UpdateEventoData) => {
  try {
    const evento = await prisma.evento.update({
      where: { id_evento: data.id_evento },
      data: {
        denominacion: data.denominacion.trim(),
        descripcion: data.descripcion?.trim() || null,
        fecha_evento: data.fecha_evento,
        hora_inicio: data.hora_inicio,
        hora_fin: data.hora_fin,
        activo: data.activo,
      },
    });

    return {
      ok: true,
      message: "Evento actualizado exitosamente",
      evento,
    };
  } catch (error) {
    console.error("Error al actualizar evento:", error);
    return {
      ok: false,
      error: "Error al actualizar el evento",
    };
  }
};
