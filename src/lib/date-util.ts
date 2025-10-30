
/**
 * Obtiene la fecha y hora actual en Perú (UTC-5)
 * Siempre usa UTC como base y resta 5 horas, sin importar dónde esté desplegado
 * @returns Date object con la hora peruana
 */
export function getPeruDateTime(): Date {
  const now = new Date(); // Hora UTC del sistema
  const utcTime = now.getTime(); // Timestamp UTC en milisegundos
  const peruOffset = -5 * 60 * 60 * 1000; // -5 horas en milisegundos
  return new Date(utcTime + peruOffset);
}

/**
 * Formatea una fecha sin conversión de zona horaria
 * @param date - Fecha en formato Date o string ISO
 * @param format - Formato deseado: 'short' (1 Ene. 2024), 'long' (1 Enero 2024), 'iso' (2024-01-01)
 * @returns Fecha formateada en español
 */
export function formatDateLocal(
  date: Date | string,
  format: 'short' | 'long' | 'iso' = 'short'
): string {
  const dateStr = typeof date === 'string' ? date : date.toISOString();
  const [year, month, day] = dateStr.split('T')[0].split('-');
  
  if (format === 'iso') {
    return `${year}-${month}-${day}`;
  }
  
  const mesesCortos = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const mesesLargos = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  
  const meses = format === 'short' ? mesesCortos : mesesLargos;
  const mesNombre = meses[parseInt(month) - 1];
  const suffix = format === 'short' ? '.' : '';
  
  return `${parseInt(day)} ${mesNombre}${suffix} ${year}`;
}

/**
 * Extrae la hora de una fecha sin conversión de zona horaria
 * @param date - Fecha en formato Date o string ISO
 * @param includeSeconds - Si se incluyen los segundos (HH:mm:ss)
 * @returns Hora formateada (HH:mm o HH:mm:ss)
 */
export function extractTimeLocal(
  date: Date | string,
  includeSeconds: boolean = false
): string {
  const dateStr = typeof date === 'string' ? date : date.toISOString();
  const time = dateStr.split('T')[1];
  
  return includeSeconds ? time.substring(0, 8) : time.substring(0, 5);
}

/**
 * Formatea fecha y hora completa sin conversión de zona horaria
 * @param date - Fecha en formato Date o string ISO
 * @param dateFormat - Formato de fecha: 'short', 'long', 'iso'
 * @param includeSeconds - Si se incluyen los segundos en la hora
 * @returns Fecha y hora formateadas (ej: "1 Ene. 2024 14:30")
 */
export function formatDateTimeLocal(
  date: Date | string,
  dateFormat: 'short' | 'long' | 'iso' = 'short',
  includeSeconds: boolean = false
): string {
  const fechaFormateada = formatDateLocal(date, dateFormat);
  const horaFormateada = extractTimeLocal(date, includeSeconds);
  
  return `${fechaFormateada} ${horaFormateada}`;
}
