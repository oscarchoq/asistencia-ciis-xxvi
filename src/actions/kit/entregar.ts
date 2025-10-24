"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";

export const entregarKit = async (codigo: string) => {
  try {
    // 1. Verificar autenticación
    const session = await auth();
    if (!session?.user?.id_usuario) {
      return {
        ok: false,
        message: "No autenticado",
      };
    }

    // 2. Buscar la inscripción por número de documento
    const inscripcion = await prisma.inscripcion.findUnique({
      where: { numero_documento: codigo },
    });

    if (!inscripcion) {
      return {
        ok: false,
        message: "Número de documento no válido o no encontrado",
      };
    }

    console.log(inscripcion)

    // 3. Verificar que el pago esté validado
    if (!inscripcion.pago_validado) {
      return {
        ok: false,
        message: "El pago no ha sido validado. No se puede entregar el kit.",
      };
    }

    // 4. Verificar si ya se entregó un kit
    const kitExistente = await prisma.kit.findUnique({
      where: { id_inscripcion: inscripcion.id_inscripcion },
    });

    if (kitExistente) {
      return {
        ok: false,
        message: "Ya se entregó un kit a esta persona",
        inscripcion: {
          nombres: inscripcion.nombres,
          apellidos: inscripcion.apellidos,
          documento: inscripcion.numero_documento,
        },
      };
    }

    console.log(kitExistente)

    // 5. Registrar la entrega del kit
    const kit = await prisma.kit.create({
      data: {
        id_inscripcion: inscripcion.id_inscripcion,
        entregado: true,
        id_usuario: session.user.id_usuario,
      },
    });

    console.log(kit)

    return {
      ok: true,
      message: "Kit entregado exitosamente",
      inscripcion: {
        nombres: inscripcion.nombres,
        apellidos: inscripcion.apellidos,
        documento: inscripcion.numero_documento,
      },
      kit,
    };
  } catch (error) {
    console.error("Error al entregar kit:", error);
    return {
      ok: false,
      message: "Error al entregar el kit",
    };
  }
};
