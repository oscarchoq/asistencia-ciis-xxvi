"use server";

import prisma from "@/lib/prisma";
import { PlanType, PaymentMethod, InscriptionType } from "@prisma/client";
import { normalizeEmail, capitalizeName } from "@/lib/string-utils";
import { revalidatePath } from "next/cache";

interface UpdateInscripcionInput {
  id_inscripcion: string;
  correo: string;
  nombres: string;
  apellidos: string;
  numero_documento: string;
  celular: string;
  plan: PlanType;
  metodo_pago: PaymentMethod;
  tipo_inscripcion: InscriptionType;
  pais?: string;
  universidad?: string;
  observaciones?: string;
}

export const updateInscripcion = async (data: UpdateInscripcionInput) => {
  try {
    // Normalizar y capitalizar los datos
    const correoNormalizado = normalizeEmail(data.correo);
    const nombresCapitalizados = capitalizeName(data.nombres);
    const apellidosCapitalizados = capitalizeName(data.apellidos);

    // Validar que la inscripción exista
    const existingInscripcion = await prisma.inscripcion.findUnique({
      where: {
        id_inscripcion: data.id_inscripcion,
      },
    });

    if (!existingInscripcion) {
      return {
        ok: false,
        error: "La inscripción no existe",
      };
    }

    // Validar que el número de documento no esté en uso por otra inscripción
    if (data.numero_documento !== existingInscripcion.numero_documento) {
      const documentoEnUso = await prisma.inscripcion.findUnique({
        where: {
          numero_documento: data.numero_documento,
        },
      });

      if (documentoEnUso) {
        return {
          ok: false,
          error: "Ya existe una inscripción con este número de documento",
        };
      }
    }

    // Actualizar la inscripción
    const inscripcion = await prisma.inscripcion.update({
      where: {
        id_inscripcion: data.id_inscripcion,
      },
      data: {
        correo: correoNormalizado,
        nombres: nombresCapitalizados,
        apellidos: apellidosCapitalizados,
        numero_documento: data.numero_documento.trim(),
        celular: data.celular.trim(),
        plan: data.plan,
        metodo_pago: data.metodo_pago,
        tipo_inscripcion: data.tipo_inscripcion,
        pais: data.pais?.trim() || undefined,
        universidad: data.universidad?.trim() || undefined,
        observaciones: data.observaciones?.trim() || undefined,
      },
    });

    // revalidatePath("/");
    revalidatePath("/inscripcion", 'page');

    return {
      ok: true,
      inscripcion,
      message: "Inscripción actualizada exitosamente",
    };
  } catch (error) {
    console.error("Error al actualizar inscripción:", error);
    return {
      ok: false,
      error: "Error al actualizar la inscripción",
    };
  }
};
