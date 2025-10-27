"use server";

import { auth } from "@/auth.config";
import prisma from "@/lib/prisma";
import { decryptBase64 } from "@/lib/base64-util";
import { revalidatePath } from "next/cache";

export const entregarKit = async (codigoEncriptado: string) => {
  try {
    // 1. Verificar autenticación
    const session = await auth();
    if (!session?.user?.id_usuario) {
      return {
        ok: false,
        message: "No autenticado",
      };
    }

    // 2. Desencriptar el código
    let numeroDocumento: string;
    try {
      numeroDocumento = decryptBase64(codigoEncriptado.trim());
      console.log("Código desencriptado:", numeroDocumento);
    } catch (error) {
      console.error("Error al desencriptar:", error);
      return {
        ok: false,
        message: "Código inválido o corrupto",
      };
    }

    // 3. Buscar la inscripción por número de documento
    const inscripcion = await prisma.inscripcion.findUnique({
      where: { numero_documento: numeroDocumento },
    });

    if (!inscripcion) {
      return {
        ok: false,
        message: `No se encontró ninguna inscripción con el documento: ${numeroDocumento}`,
      };
    }

    console.log(inscripcion)

    // 4. Verificar que el pago esté validado
    if (!inscripcion.pago_validado) {
      return {
        ok: false,
        message: "El pago no ha sido validado. No se puede entregar el kit.",
      };
    }

    // 5. Verificar si ya se entregó un kit
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

    // 6. Registrar la entrega del kit con fecha local
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Lima" }));

    const kit = await prisma.kit.create({
      data: {
        id_inscripcion: inscripcion.id_inscripcion,
        entregado: true,
        fecha_entrega: now, // Guardar fecha local (PostgreSQL @db.Date() guardará solo la fecha)
        id_usuario: session.user.id_usuario,
      },
    });

    console.log(kit)

    // Invalidar caché de kits
    revalidatePath('/eventkit/listar', 'page');
    revalidatePath('/', 'page');

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
