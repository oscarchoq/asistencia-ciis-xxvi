"use server";

import prisma from "@/lib/prisma";

interface GetInscripcionesParams {
  page?: number;
  pageSize?: number;
  documento?: string; // Búsqueda solo por numero documento
  pago_validado?: string; // "true" | "false"
  tipo_inscripcion?: string; // "presencial" | "formulario"
}

export const getInscripcionesPaginated = async (params?: GetInscripcionesParams) => {
  try {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 5; // ← Default: 5 registros por página
    const skip = (page - 1) * pageSize;

    // Construir WHERE simple
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};

    // Filtro por documento
    if (params?.documento) {
      where.numero_documento = {
        contains: params.documento,
        mode: "insensitive",
      };
    }

    // Filtro por pago validado
    if (params?.pago_validado) {
      where.pago_validado = params.pago_validado === "true";
    }

    // Filtro por tipo inscripción
    if (params?.tipo_inscripcion) {
      where.tipo_inscripcion = params.tipo_inscripcion;
    }

    // Ejecutar queries en paralelo
    const [inscripciones, totalCount] = await Promise.all([
      prisma.inscripcion.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.inscripcion.count({ where }),
    ]);

    const pageCount = Math.ceil(totalCount / pageSize);

    return {
      ok: true,
      inscripciones,
      totalCount,
      pageCount,
      currentPage: page,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      error: "Failed to fetch inscripciones",
      inscripciones: [],
      totalCount: 0,
      pageCount: 0,
      currentPage: 1,
    };
  }
};

export const getInscripciones = async () => {
  try {
    const inscripciones = await prisma.inscripcion.findMany();
    
    return {
      ok: true,
      inscripciones: inscripciones,
    }
  } catch (error) {
      console.log(error)
      return {
        ok: false,
        error: "Failed to fetch planes"
      }
  }
}
