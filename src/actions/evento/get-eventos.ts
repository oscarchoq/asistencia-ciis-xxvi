"use server";

import prisma from "@/lib/prisma";

interface GetEventosParams {
  page?: number;
  pageSize?: number;
  fecha_evento?: string; // Formato: YYYY-MM-DD
}

export const getEventosPaginated = async (params?: GetEventosParams) => {
  try {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 5;
    const skip = (page - 1) * pageSize;

    // Construir WHERE dinámicamente
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    // Filtro por fecha de evento
    if (params?.fecha_evento) {
      const fecha = new Date(params.fecha_evento);
      where.fecha_evento = fecha;
    }

    // Obtener eventos con paginación
    const [eventos, totalCount] = await Promise.all([
      prisma.evento.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: {
          fecha_evento: "desc",
        },
      }),
      prisma.evento.count({ where }),
    ]);

    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      ok: true,
      eventos,
      totalCount,
      pageCount,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error al obtener eventos paginados:", error);
    return {
      ok: false,
      error: "Error al obtener eventos",
      eventos: [],
      totalCount: 0,
      pageCount: 0,
      currentPage: 1,
    };
  }
};
