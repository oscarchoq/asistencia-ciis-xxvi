"use server";

import prisma from "@/lib/prisma";

interface GetKitsParams {
  page?: number;
  pageSize?: number;
  documento?: string;
  fecha_entrega?: string; // "true" | "false"
}

export const getKitsPaginated = async (params?: GetKitsParams) => {
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

    // Filtro por estado de entrega
    if (params?.fecha_entrega) {
      const fecha = new Date(params.fecha_entrega);
      where.fecha_entrega = fecha;
    }

    // Obtener kits con paginación
    const [kits, totalCount] = await Promise.all([
      prisma.kit.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          inscripcion: true,
          entregado_por: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.kit.count({ where }),
    ]);

    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      ok: true,
      kits,
      totalCount,
      pageCount,
      currentPage: page,
    };
  } catch (error) {
    console.error("Error al obtener kits paginados:", error);
    return {
      ok: false,
      error: "Error al obtener kits",
      kits: [],
      totalCount: 0,
      pageCount: 0,
      currentPage: 1,
    };
  }
};
