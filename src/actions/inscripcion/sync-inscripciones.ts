"use server";

import { revalidatePath } from "next/cache";

export const syncInscripciones = async() => {
  const webhookUrl = process.env.WEBHOOK_URL;
  const webhookUser = process.env.WEBHOOK_USER;
  const webhookPass = process.env.WEBHOOK_PASS;

  if (!webhookUrl || !webhookUser || !webhookPass) {
    throw new Error("Configuración de webhook incompleta. Verifica las variables de entorno.");
  }

  const auth = Buffer.from(`${webhookUser}:${webhookPass}`).toString('base64');

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), // El webhook no espera nada
    });

    console.log(response)

    const data = await response.json();
    console.log(data)

    if (response.status === 200) {
      return {
        ok: true,
        message: data.message || "No hay registros para sincronizar",
        rows: 0,
      };
    } else if (response.status === 409) {
      return {
        ok: false,
        message: data.message || "Conflicto en la base de datos",
        error: data.error,
      };
    } else if (response.status === 201) {
      revalidatePath('/');
      revalidatePath("/inscripcion", "page");
      return {
        ok: true,
        message: data.response || "Sincronización terminada",
        rows: data.rows || 0,
      };
    } else {
      return {
        ok: false,
        message: `Error inesperado: ${response.status} - ${data.message || 'Sin mensaje'}`,
      };
    }
  } catch (error) {
    console.error("Error en la sincronización:", error);
    return {
      ok: false,
      message: "Error de conexión o interno",
    };
  }
}

