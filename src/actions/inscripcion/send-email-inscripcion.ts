"use server";

import prisma from "@/lib/prisma";
import { sendMail } from "@/config/nodemailer";
import { generateQR } from "@/lib/qr-generator";
import { loadTemplate } from "@/lib/template-loader";
import { Inscripcion } from "@prisma/client";

interface SendEmailResponse {
  ok: boolean;
  message: string;
  data?: {
    enviados: number;
    fallidos: number;
  };
}

export const sendEmailInscripciones = async (
  inscripciones: Inscripcion[]
): Promise<SendEmailResponse> => {
  try {
    let enviados = 0;
    let fallidos = 0;

    // Filtrar inscripciones por tipo_inscripcion = "virtual" y email_enviado = false
    const inscripcionesAEnviar = inscripciones.filter(
      (inscripcion) =>
        inscripcion.tipo_inscripcion === "virtual" &&
        inscripcion.email_enviado === false
    );

    if (inscripcionesAEnviar.length === 0) {
      return {
        ok: true,
        message: "No hay inscripciones pendientes para enviar correos.",
      };
    }

    // Cargar template una sola vez
    let htmlTemplate: string;
    try {
      htmlTemplate = await loadTemplate("inscription-confirmation.html");
    } catch (error) {
      console.error("Error cargando template:", error);
      return {
        ok: false,
        message: "Error al cargar el template de email",
      };
    }

    // Procesar cada inscripción
    for (const inscripcion of inscripcionesAEnviar) {
      try {
        // Generar QR (encriptado a partir del numero_documento)
        const qrResult = await generateQR(inscripcion.numero_documento);

        if (!qrResult.ok || !qrResult.qrBase64 || !qrResult.qrBuffer) {
          console.error(
            `No se pudo generar QR para ${inscripcion.numero_documento}`
          );
          fallidos++;
          continue;
        }

        const qrCid = `qr-${inscripcion.id_inscripcion}@ciis`;

        // Preparar contenido del email con el template
        const htmlContent = htmlTemplate
          .replace("{{name}}", `${inscripcion.nombres} ${inscripcion.apellidos}`)
          .replace("{{qrImage}}", `cid:${qrCid}`);

        // Enviar email con el QR como attachment (2 versiones: una incrustada, otra descargable)
        await sendMail({
          to: inscripcion.correo,
          name: `${inscripcion.nombres} ${inscripcion.apellidos}`,
          subject: "Confirmación de tu Inscripción - CIIS XXVI",
          html: htmlContent,
          attachments: [
            {
              filename: `qr_identificacion.png`,
              content: qrResult.qrBuffer,
              contentType: "image/png",
              cid: `qr-${inscripcion.id_inscripcion}@ciis`,
            },
            {
              filename: `${inscripcion.numero_documento}_qr.png`,
              content: qrResult.qrBuffer,
              contentType: "image/png",
            },
          ],
        });

        // Actualizar email_enviado a true en la BD
        await prisma.inscripcion.update({
          where: { id_inscripcion: inscripcion.id_inscripcion },
          data: { email_enviado: true },
        });

        enviados++;
      } catch (error) {
        console.error(
          `Error al enviar email a ${inscripcion.correo} - ${inscripcion.nombres}:`,
          error
        );
        fallidos++;
      }
    }

    return {
      ok: true,
      message: `Se enviaron ${enviados} correos exitosamente. ${fallidos > 0 ? `${fallidos} fallaron.` : ""
        }`,
      data: {
        enviados,
        fallidos,
      },
    };
  } catch (error) {
    console.error("Error en sendEmailInscripciones:", error);
    return {
      ok: false,
      message: "Error al procesar el envío de correos",
    };
  }
};
