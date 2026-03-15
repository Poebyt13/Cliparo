/**
 * Formatta una data in italiano.
 *
 * @param {Date|string|number} date - Data da formattare
 * @param {Object} [options] - Opzioni di Intl.DateTimeFormat
 * @param {string} [options.day="2-digit"]
 * @param {string} [options.month="long"]
 * @param {string} [options.year="numeric"]
 * @returns {string} Data formattata (es. "15 marzo 2026")
 */
export function formatDate(date, options = {}) {
  const d = new Date(date);
  if (isNaN(d.getTime())) return "—";

  return d.toLocaleDateString("it-IT", {
    day: options.day || "2-digit",
    month: options.month || "long",
    year: options.year || "numeric",
  });
}

/**
 * Formatta una data in formato breve (dd/mm/yyyy).
 *
 * @param {Date|string|number} date
 * @returns {string} Data formattata (es. "15/03/2026")
 */
export function formatDateShort(date) {
  return formatDate(date, { day: "2-digit", month: "2-digit", year: "numeric" });
}
