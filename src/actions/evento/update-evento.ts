"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface UpdateEventoData {
  id_evento: string;
  denominacion: string;
  descripcion?: string;
  fecha_evento: string | Date; // ISO string sin conversión de zona horaria
  hora_inicio: string | Date;  // ISO string sin conversión de zona horaria
  hora_fin: string | Date;     // ISO string sin conversión de zona horaria
  activo: boolean;
}

export const updateEvento = async (data: UpdateEventoData) => {
  try {
    
    // Verificar que el usuario esté autenticado
    const session = await auth();
    if (!session?.user?.id_usuario) {
      return {
        ok: false,
        error: "No autorizado - Debe iniciar sesión",
      };
    }

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

    // Invalidar caché de eventos
    revalidatePath('/evento', 'page');
    revalidatePath('/', 'page');

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
