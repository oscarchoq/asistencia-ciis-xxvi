"use server";

import prisma from "@/lib/prisma";
import { PlanType, PaymentMethod, InscriptionType, Semestre } from "@prisma/client";
import { normalizeEmail, capitalizeName } from "@/lib/string-utils";
import { revalidatePath } from "next/cache";

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
  observaciones?: string;
  codigo_matricula?: string;
  semestre?: Semestre;
}

export const createInscripcion = async (data: CreateInscripcionInput) => {
  try {
    // Normalizar y capitalizar los datos
    const correoNormalizado = normalizeEmail(data.correo);
    const nombresCapitalizados = capitalizeName(data.nombres);
    const apellidosCapitalizados = capitalizeName(data.apellidos);
    
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
        codigo_matricula: data.codigo_matricula?.trim() || undefined,
        semestre: data.semestre || undefined,
        pago_validado: false,
        email_enviado: false,
      },
    });

    revalidatePath("/")
    revalidatePath("/inscripcion", "page");

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
