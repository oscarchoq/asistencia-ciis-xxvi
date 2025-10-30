"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateEventoData {
  denominacion: string;
  descripcion?: string;
  fecha_evento: string | Date; // ISO string sin conversión de zona horaria
  hora_inicio: string | Date;  // ISO string sin conversión de zona horaria
  hora_fin: string | Date;     // ISO string sin conversión de zona horaria
}

export const createEvento = async (data: CreateEventoData) => {
  try {

    // Verificar que el usuario esté autenticado
    const session = await auth();
    if (!session?.user?.id_usuario) {
      return {
        ok: false,
        error: "No autorizado - Debe iniciar sesión",
      };
    }

    const evento = await prisma.evento.create({
      data: {
        denominacion: data.denominacion.trim(),
        descripcion: data.descripcion?.trim() || null,
        fecha_evento: data.fecha_evento,
        hora_inicio: data.hora_inicio,
        hora_fin: data.hora_fin,
      },
    });

    // Invalidar caché de eventos
    revalidatePath('/evento', 'page');
    revalidatePath('/', 'page');

    return {
      ok: true,
      message: "Evento creado exitosamente",
      evento,
    };
  } catch (error) {
    console.error("Error al crear evento:", error);
    return {
      ok: false,
      error: "Error al crear el evento",
    };
  }
};
