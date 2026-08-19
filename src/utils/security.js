/**
 * Módulo de Seguridad, Sanitización de Entradas y Cumplimiento PCI-DSS / OWASP
 */

export const Security = {
  /**
   * Sanitiza cualquier cadena de texto para evitar ataques XSS
   * Reemplaza caracteres HTML peligrosos por sus entidades seguras
   */
  sanitize(input) {
    if (typeof input !== 'string') return input;
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  /**
   * Valida formato de correo electrónico
   */
  isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(String(email).trim());
  },

  /**
   * Valida código postal
   */
  isValidPostalCode(postalCode) {
    return /^[a-zA-Z0-9\s-]{3,10}$/.test(String(postalCode).trim());
  },

  /**
   * Genera un Token CSRF seguro para validar peticiones al servidor
   */
  generateCSRFToken() {
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Simulación de Tokenización PCI-DSS
   * En producción, esta función es ejecutada por el iframe de Stripe Elements / MercadoPago SDK
   * para que los números de tarjeta NUNCA toquen tu servidor ni tu base de datos.
   */
  tokenizeCard(cardNumber, expMonth, expYear, cvc) {
    const cleanNumber = (cardNumber || '').replace(/\s+/g, '');
    if (cleanNumber.length < 13) {
      throw new Error('Número de tarjeta inválido para tokenización.');
    }
    const last4 = cleanNumber.slice(-4);
    const mockToken = `tok_aura_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    return {
      token: mockToken,
      last4: last4,
      brand: cleanNumber.startsWith('4') ? 'Visa' : cleanNumber.startsWith('5') ? 'Mastercard' : 'Amex',
      expMonth,
      expYear,
      isPCISecured: true
    };
  }
};
