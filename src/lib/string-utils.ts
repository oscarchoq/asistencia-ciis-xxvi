/**
 * Normaliza un correo electrónico convirtiéndolo a minúsculas y eliminando espacios
 * @param email - El correo electrónico a normalizar
 * @returns El correo normalizado en minúsculas
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/**
 * Capitaliza la primera letra de cada palabra en un texto
 * @param text - El texto a capitalizar
 * @returns El texto con cada palabra capitalizada
 */
export function capitalizeWords(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Capitaliza nombres completos (nombres y apellidos)
 * Maneja múltiples espacios y limpia el texto
 * @param name - El nombre a capitalizar
 * @returns El nombre capitalizado correctamente
 */
export function capitalizeName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ') // Reemplaza múltiples espacios por uno solo
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}
