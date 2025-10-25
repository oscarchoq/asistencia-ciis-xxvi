import QRCode from "qrcode";
import { encryptBase64 } from "./base64-util";

interface QRGenerationResult {
  ok: boolean;
  qrBase64?: string;
  qrBuffer?: Buffer;
  textBase64?: string;
  error?: string;
}

/**
 * Genera un código QR encriptado a partir del número de documento
 * @param numeroDocumento - Número de documento del usuario
 * @returns Objeto con QR en formato base64 (para HTML) y Buffer (para adjuntar)
 */
export async function generateQR(
  numeroDocumento: string
): Promise<QRGenerationResult> {
  try {
    // Paso 1: Encriptar el número de documento
    const encryptedDocumento = encryptBase64(numeroDocumento);

    // Paso 2: Generar QR como DataURL (base64)
    const qrBase64 = await QRCode.toDataURL(encryptedDocumento, {
      errorCorrectionLevel: "H",
      type: "image/png",
      margin: 1,
      width: 300,
    });

    // Paso 3: Generar QR como Buffer (para adjuntar)
    const qrBuffer = await QRCode.toBuffer(encryptedDocumento, {
      errorCorrectionLevel: "H",
      type: "png",
      margin: 1,
      width: 300,
    });

    // Tambien retornar el texto encriptado en base64
    const textBase64 = encryptedDocumento;

    return {
      ok: true,
      qrBase64,
      qrBuffer,
      textBase64,
    };
  } catch (error) {
    console.error("Error generando QR:", error);
    return {
      ok: false,
      error: `Error al generar QR: ${error instanceof Error ? error.message : "Error desconocido"}`,
    };
  }
}
