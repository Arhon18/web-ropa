/**
 * ============================================================================
 * GUÍA DE INTEGRACIÓN DE APIS Y CONFIGURACIÓN DEL SISTEMA
 * ============================================================================
 * 
 * Este archivo centraliza los parámetros de conexión para:
 * 1. Pasarelas de Pago Tokenizadas (Stripe, PayPal, MercadoPago)
 * 2. Integración Logística y Tarifas en Tiempo Real (DHL, FedEx, Shippo)
 * 3. Conexión a Base de Datos y Backend (PostgreSQL, Supabase o Node.js API)
 * 
 * INSTRUCCIONES DE SEGURIDAD:
 * - NUNCA expongas 'Secret Keys' en el código del cliente (Frontend).
 * - Utiliza variables de entorno (.env) para claves públicas 'pk_test_...'
 * - Las transacciones finales deben confirmarse siempre en tu servidor backend.
 */

export const CONFIG = {
  // Configuración de la Tienda
  store: {
    name: 'AURA Studio',
    currency: 'USD', // USD, EUR, MXN
    currencySymbol: '$',
    freeShippingThreshold: 80.00, // Envío gratis a partir de $80 USD
    taxRate: 0.00, // 0% incluido en precio
    defaultShippingCost: 12.00,
    expressShippingCost: 19.50,
    supportEmail: 'concierge@aurastudio.com',
    supportPhone: '+34 910 00 22 44'
  },

  // --------------------------------------------------------------------------
  // 1. PASARELAS DE PAGO (Puntos de Integración de API Keys)
  // --------------------------------------------------------------------------
  payments: {
    stripe: {
      enabled: true,
      /**
       * Inserte aquí su Publishable Key de Stripe.
       * Ejemplo: 'pk_test_51Mz...' (Obtener en https://dashboard.stripe.com/apikeys)
       */
      publishableKey: 'pk_test_TYooMQauvdEDq54NiTphI7jx',
      currency: 'usd',
      statementDescriptor: 'AURA STUDIO FASHION',
      apiVersion: '2023-10-16'
    },
    paypal: {
      enabled: true,
      /**
       * Inserte aquí su Client ID de PayPal Developer.
       * Ejemplo: 'sb' (sandbox) o 'AX...' (Obtener en https://developer.paypal.com)
       */
      clientId: 'sb',
      currency: 'USD',
      intent: 'capture'
    },
    mercadoPago: {
      enabled: true,
      /**
       * Inserte aquí su Public Key de Mercado Pago.
       * Ejemplo: 'TEST-xxxx-xxxx-xxxx' (Obtener en https://www.mercadopago.com/developers)
       */
      publicKey: 'TEST-48892182-3819-4822-b881-281928371928'
    }
  },

  // --------------------------------------------------------------------------
  // 2. INTEGRACIÓN LOGÍSTICA & ENVÍOS EN TIEMPO REAL
  // --------------------------------------------------------------------------
  shipping: {
    provider: 'shippo', // 'shippo', 'dhl', 'fedex' o 'custom'
    /**
     * API Key pública o Endpoint para cálculo de tarifas por Código Postal
     */
    apiEndpoint: 'https://api.goshippo.com/v1/shipments/',
    apiKeyPublic: 'shippo_test_key_sample_84920492810',
    warehousePostalCode: '28001',
    warehouseCountry: 'ES',
    carriers: [
      { id: 'standard', name: 'Envío Estándar Ecológico (3-5 días hábiles)', cost: 12.00, freeOver: 80.00 },
      { id: 'express', name: 'DHL Express 24h Prioritario', cost: 19.50, freeOver: 150.00 },
      { id: 'pickup', name: 'Retiro en Boutique Flagship (Paseo de la Moda 108)', cost: 0.00, freeOver: 0 }
    ]
  },

  // --------------------------------------------------------------------------
  // 3. BACKEND & BASE DE DATOS
  // --------------------------------------------------------------------------
  backend: {
    /**
     * Endpoint URL de tu servidor backend (Node.js/Express, Django, Laravel o Supabase)
     * Ejemplo: 'https://api.aurastudio.com/v1'
     */
    apiUrl: 'https://api.web-ropa.internal/v1',
    supabaseUrl: 'https://xyzcompany.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    endpoints: {
      products: '/products',
      createPaymentIntent: '/payments/create-intent',
      verifyOrder: '/orders/verify',
      trackOrder: '/orders/track',
      submitReview: '/reviews/submit'
    }
  },

  // Cupones de Descuento Activos
  coupons: {
    'BIENVENIDA10': { discountPercent: 10, description: '10% de descuento en tu primera compra' },
    'AURA2026': { discountPercent: 15, description: '15% de descuento especial de temporada' },
    'ENVIOVIP': { freeShipping: true, description: 'Envío gratis asegurado' }
  }
};
