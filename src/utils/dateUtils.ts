/**
 * Utilidades para el manejo de fechas en formato DD/MM/YYYY.
 */

/**
 * Formatea un objeto Date a un string DD/MM/YYYY.
 */
export function formatFecha(date: Date): string {
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const anio = String(date.getFullYear());
  return `${dia}/${mes}/${anio}`;
}

/**
 * Convierte un string DD/MM/YYYY a un objeto Date.
 */
export function parseFecha(value: string): Date {
  const hoy = new Date();
  if (!value) return hoy;
  
  const soloDigitos = value.replace(/\D/g, '');
  if (soloDigitos.length >= 8) {
    const d = parseInt(soloDigitos.slice(0, 2), 10);
    const m = parseInt(soloDigitos.slice(2, 4), 10) - 1;
    const y = parseInt(soloDigitos.slice(4, 8), 10);
    const dt = new Date(y, m, d);
    if (!isNaN(dt.getTime())) return dt;
  }
  
  const parts = value.split('/');
  if (parts.length === 3) {
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    let y = parts[2];
    if (y.length === 2) y = '20' + y;
    const yy = parseInt(y, 10);
    const dt = new Date(yy, m, d);
    if (!isNaN(dt.getTime())) return dt;
  }
  return hoy;
}

/**
 * Aplica una máscara DD/MM/YYYY a un string de entrada.
 */
export function maskFechaInput(text: string): string {
  const digits = text.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

/**
 * Formatea un string ISO (YYYY-MM-DD) a DD/MM/YY.
 */
export function formatFechaISOToDDMMYY(isoString: string): string {
  if (!isoString) return 'N/A';
  try {
    const [year, month, day] = isoString.split('T')[0].split('-');
    return `${day}/${month}/${year.slice(-2)}`;
  } catch (e) {
    return 'N/A';
  }
}
