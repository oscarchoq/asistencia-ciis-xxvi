"use server";

import prisma from "@/lib/prisma";
import { sendMail } from "@/config/nodemailer";
import { generateQR } from "@/lib/qr-generator";
import { loadTemplate } from "@/lib/template-loader";
import { Inscripcion } from "@prisma/client";
import { auth } from "@/auth.config";

interface SendEmailIndividualResponse {
  ok: boolean;
  message: string;
  error?: string;
}

/**
 * Envía un email de confirmación individual a una inscripción
 * @param inscripcion - Objeto de inscripción al que se le enviará el email
 * @param updateEmailStatus - Si es true, actualiza el campo email_enviado en la BD (default: true)
 * @returns Respuesta con ok, message y error opcional
 */
export const sendEmailInscripcionIndividual = async (
  inscripcion: Inscripcion,
  updateEmailStatus: boolean = true
): Promise<SendEmailIndividualResponse> => {
  try {

    // Verificar que el usuario esté autenticado
    const session = await auth();
    if (!session?.user?.id_usuario) {
      return {
        ok: false,
        message: "No autorizado - Debe iniciar sesión",
        error: "Unauthorized",
      };
    }

    // Validar que la inscripción tenga correo
    if (!inscripcion.correo) {
      return {
        ok: false,
        message: "La inscripción no tiene un correo válido",
        error: "Email no proporcionado",
      };
    }

    // Generar QR (encriptado a partir del numero_documento)
    const qrResult = await generateQR(inscripcion.numero_documento);

    if (!qrResult.ok || !qrResult.qrBase64 || !qrResult.qrBuffer) {
      console.error(
        `No se pudo generar QR para ${inscripcion.numero_documento}`
      );
      return {
        ok: false,
        message: "Error al generar código QR",
        error: "QR generation failed",
      };
    }

    // Cargar template de email
    let htmlTemplate: string;
    try {
      htmlTemplate = await loadTemplate("inscription-confirmation.html");
    } catch (error) {
      console.error("Error cargando template:", error);
      return {
        ok: false,
        message: "Error al cargar el template de email",
        error: error instanceof Error ? error.message : "Template loading failed",
      };
    }

    const qrCid = `qr-${inscripcion.id_inscripcion}@ciis`;

    // Preparar contenido del email con el template
    const htmlContent = htmlTemplate
      .replace("{{name}}", `${inscripcion.nombres} ${inscripcion.apellidos}`)
      .replace("{{qrImage}}", `cid:${qrCid}`);

    // Enviar email con el QR como attachment
    await sendMail({
      to: inscripcion.correo,
      name: `${inscripcion.nombres} ${inscripcion.apellidos}`,
      subject: "Confirmación de Inscripción - CIIS XXVI",
      html: htmlContent,
      attachments: [
        {
          filename: `qr_identificacion.png`,
          content: qrResult.qrBuffer,
          contentType: "image/png",
          cid: qrCid,
        },
        {
          filename: `${inscripcion.numero_documento}_qr.png`,
          content: qrResult.qrBuffer,
          contentType: "image/png",
        },
      ],
    });

    // Actualizar email_enviado a true en la BD si se solicita
    if (updateEmailStatus) {
      await prisma.inscripcion.update({
        where: { id_inscripcion: inscripcion.id_inscripcion },
        data: { email_enviado: true },
      });
    }

    return {
      ok: true,
      message: `Correo enviado exitosamente a ${inscripcion.correo}`,
    };
  } catch (error) {
    console.error(
      `Error al enviar email a ${inscripcion.correo} - ${inscripcion.nombres}:`,
      error
    );
    return {
      ok: false,
      message: "Error al enviar el correo electrónico",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
