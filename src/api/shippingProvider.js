/**
 * ============================================================================
 * CLIENTE DE LOGÍSTICA & TARIFAS DE ENVÍO EN TIEMPO REAL
 * ============================================================================
 */

import { CONFIG } from '../data/config.js';

export const ShippingProvider = {
  /**
   * Calcula tarifas dinámicas de envío según el Código Postal ingresado
   */
  async calculateRates(postalCode, subtotal = 0) {
    // Simulación de consulta a API de mensajería (Shippo, DHL Express o Correos)
    await new Promise(resolve => setTimeout(resolve, 600));

    const cleanZip = String(postalCode || '').trim();
    const isFree = subtotal >= CONFIG.store.freeShippingThreshold;

    return [
      {
        id: 'standard',
        name: 'Envío Estándar Ecológico',
        carrier: 'Correos Express / UPS Standard',
        deliveryEstimate: '3 a 5 días laborables',
        price: isFree ? 0 : 12.00,
        originalPrice: 12.00,
        isFree: isFree,
        badge: isFree ? '¡Gratis por superar $80!' : null
      },
      {
        id: 'express',
        name: 'DHL Express 24h Prioritario',
        carrier: 'DHL Express Worldwide',
        deliveryEstimate: '24 a 48 horas con entrega garantizada',
        price: 19.50,
        originalPrice: 19.50,
        isFree: false,
        badge: 'Recomendado'
      },
      {
        id: 'pickup',
        name: 'Retiro en Tienda Flagship (Madrid)',
        carrier: 'Boutique AURA Studio',
        deliveryEstimate: 'Listo en 2 horas',
        price: 0.00,
        originalPrice: 0.00,
        isFree: true,
        badge: 'Retiro Inmediato'
      }
    ];
  },

  /**
   * Consulta el estado de rastreo de un número de orden / tracking ID
   */
  async trackOrder(trackingNumber) {
    await new Promise(resolve => setTimeout(resolve, 800));

    const cleanNumber = (trackingNumber || '').trim().toUpperCase();

    // Datos simulados de seguimiento
    return {
      trackingNumber: cleanNumber || 'AURA-ES-89420',
      carrier: 'DHL Express Worldwide',
      status: 'in_transit', // 'confirmed', 'preparing', 'in_transit', 'delivered'
      statusLabel: 'En Camino a Destino',
      estimatedDelivery: '22 de Agosto, 2026 antes de las 18:00',
      timeline: [
        {
          title: 'Pedido Confirmado & Pagado',
          description: 'El pago ha sido procesado mediante 256-bit SSL.',
          date: '18 Ago, 10:30',
          completed: true
        },
        {
          title: 'Confección & Empaquetado Ecológico',
          description: 'Prenda inspeccionada por el equipo de control de calidad.',
          date: '18 Ago, 16:45',
          completed: true
        },
        {
          title: 'Recolectado por DHL Express',
          description: 'Centro logístico internacional Madrid-Barajas.',
          date: '19 Ago, 08:20',
          completed: true,
          current: true
        },
        {
          title: 'En Reparto Final a Domicilio',
          description: 'El mensajero asignado entregará en tu dirección.',
          date: 'Estimado 20 Ago',
          completed: false
        }
      ]
    };
  }
};
