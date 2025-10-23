"use server";

import prisma from "@/lib/prisma";
import { PlanType, PaymentMethod, InscriptionType } from "@prisma/client";

interface CreateInscripcionInput {
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
}

export const createInscripcion = async (data: CreateInscripcionInput) => {
  try {
    // Validar que el número de documento no exista
    const existingInscripcion = await prisma.inscripcion.findUnique({
      where: {
        numero_documento: data.numero_documento,
      },
    });

    if (existingInscripcion) {
      return {
        ok: false,
        error: "Ya existe una inscripción con este número de documento",
      };
    }

    // Crear la inscripción
    const inscripcion = await prisma.inscripcion.create({
      data: {
        correo: data.correo,
        nombres: data.nombres,
        apellidos: data.apellidos,
        numero_documento: data.numero_documento,
        celular: data.celular,
        plan: data.plan,
        metodo_pago: data.metodo_pago,
        tipo_inscripcion: data.tipo_inscripcion,
        pais: data.pais,
        universidad: data.universidad,
        pago_validado: false,
        email_enviado: false,
      },
    });

    return {
      ok: true,
      inscripcion,
      message: "Inscripción creada exitosamente",
    };
  } catch (error) {
    console.error("Error al crear inscripción:", error);
    return {
      ok: false,
      error: "Error al crear la inscripción",
    };
  }
};
