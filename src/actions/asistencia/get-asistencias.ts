"use server";

import prisma from "@/lib/prisma";

interface GetAsistenciasParams {
  page?: number;
  pageSize?: number;
  documento?: string;
  fecha_asistencia?: string; // Formato: YYYY-MM-DD
}

export const getAsistenciasPaginated = async (params?: GetAsistenciasParams) => {
  try {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 5;
    const skip = (page - 1) * pageSize;

    // Construir WHERE dinámicamente
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    // Filtro por documento (busca en inscripcion)
    if (params?.documento) {
      where.inscripcion = {
        numero_documento: {
          contains: params.documento,
        },
      };
    }

    // Filtro por fecha de asistencia
    if (params?.fecha_asistencia) {
      const fecha = new Date(params.fecha_asistencia);
      where.fecha_asistencia = fecha;
    }

    // Obtener asistencias con paginación
    const [asistencias, totalCount] = await Promise.all([
      prisma.asistencia.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          inscripcion: true,
          evento: true,
          registrado_por: {
            select: {
              name: true,
              correo: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.asistencia.count({ where }),
    ]);

    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      ok: true,
      asistencias,
      totalCount,
      pageCount,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error al obtener asistencias paginadas:", error);
    return {
      ok: false,
      error: "Error al obtener asistencias",
      asistencias: [],
      totalCount: 0,
      pageCount: 0,
      currentPage: 1,
    };
  }
};
