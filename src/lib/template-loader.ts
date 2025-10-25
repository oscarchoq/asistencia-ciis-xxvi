import { readFile } from "fs/promises";
import path from "path";

/**
 * Carga un template HTML de la carpeta src/templates
 * @param filename - Nombre del archivo (ej: "inscription-confirmation.html")
 * @returns Contenido del archivo como string
 */
export async function loadTemplate(filename: string): Promise<string> {
  try {
    const templatePath = path.join(
      process.cwd(),
      "src/templates",
      filename
    );
    const content = await readFile(templatePath, "utf-8");
    return content;
  } catch (error) {
    console.error(`Error cargando template ${filename}:`, error);
    throw new Error(
      `No se pudo cargar el template: ${filename}. ${error instanceof Error ? error.message : "Error desconocido"
      }`
    );
  }
}
