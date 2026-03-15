/**
 * Formatta un importo in Euro.
 *
 * @param {number} amount - Importo in centesimi (come restituito da Stripe) o in euro
 * @param {Object} [options]
 * @param {boolean} [options.cents=true] - Se true, l'importo è in centesimi (÷ 100)
 * @returns {string} Prezzo formattato (es. "€ 9,00")
 */
export function formatPrice(amount, { cents = true } = {}) {
  const value = cents ? amount / 100 : amount;

  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}
