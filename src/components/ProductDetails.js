/**
 * Componente Panel de Compra y Detalles de Producto (PDP)
 */

import { formatCurrency, formatDiscount } from '../utils/formatters.js';
import { store } from '../state/store.js';
import { ShippingCalculator } from './ShippingCalculator.js';

export function renderProductDetails(product, selectedColor, selectedSize, selectedMaterial, quantity) {
  const discountPercent = formatDiscount(product.originalPrice, product.price);
  const sizeObj = product.sizes.find(s => s.size === selectedSize) || product.sizes[0];
  const stock = sizeObj ? sizeObj.stock : 0;
  const isLowStock = stock > 0 && stock <= 3;
  const isOutOfStock = stock === 0;

  return `
    <div class="pdp-info">
      <!-- Categoría y Colección -->
      <div class="pdp-header-tags">
        <span class="badge badge-new">Colección 2026</span>
        <span class="badge ${product.badgeType === 'sale' ? 'badge-sale' : 'badge-new'}">${product.badge || 'Exclusivo'}</span>
      </div>

      <h1 class="pdp-title">${product.name}</h1>
      <p style="font-size: 1.05rem; color: var(--text-secondary);">${product.subtitle}</p>

      <!-- Valoraciones de Clientes -->
      <div class="pdp-rating-row">
        <div class="stars">
          ${'★'.repeat(Math.round(product.rating))}${'☆'.repeat(5 - Math.round(product.rating))}
        </div>
        <span style="font-weight: 700;">${product.rating}</span>
        <a href="#reviews-section" id="pdp-scroll-reviews">(${product.reviewCount} valoraciones verificadas)</a>
      </div>

      <!-- Precios -->
      <div class="pdp-price-wrap">
        <span class="pdp-current-price">${formatCurrency(product.price)}</span>
        ${product.originalPrice ? `<span class="pdp-original-price">${formatCurrency(product.originalPrice)}</span>` : ''}
        ${discountPercent > 0 ? `<span class="pdp-discount-badge">Ahorras ${discountPercent}%</span>` : ''}
      </div>

      <!-- Indicador Dinámico de Stock en Tiempo Real -->
      <div class="stock-status-box ${isOutOfStock ? 'out-stock' : isLowStock ? 'low-stock' : 'in-stock'}" id="pdp-stock-banner">
        <div class="stock-live-counter">
          <span class="stock-dot ${isOutOfStock ? 'out' : isLowStock ? 'low' : 'in'}"></span>
          <span>
            ${isOutOfStock 
              ? 'Agotado en esta talla' 
              : isLowStock 
              ? `¡Atención! Quedan sólo <strong>${stock} unidades</strong> disponibles` 
              : `En Stock - Listo para despacho en 24h`}
          </span>
        </div>
        <span style="font-size: 0.78rem; opacity: 0.85;">SKU: ${product.sku}</span>
      </div>

      <!-- Selector de Color -->
      <div class="variant-block">
        <div class="variant-label-row">
          <span>Color: <strong>${selectedColor.name}</strong></span>
        </div>
        <div class="color-options" id="pdp-color-selector">
          ${product.colors.map(color => `
            <button 
              class="color-option-btn ${color.id === selectedColor.id ? 'active' : ''}" 
              data-color-id="${color.id}"
              style="background-color: ${color.hex};"
              title="${color.name}"
              aria-label="Color ${color.name}"
            ></button>
          `).join('')}
        </div>
      </div>

      <!-- Selector de Talla -->
      <div class="variant-block">
        <div class="variant-label-row">
          <span>Talla: <strong>${selectedSize}</strong></span>
          <button class="size-guide-trigger" id="pdp-open-size-guide">
            <i data-lucide="ruler"></i> Guía de Tallas & Medidas
          </button>
        </div>
        <div class="size-options" id="pdp-size-selector">
          ${product.sizes.map(s => `
            <button 
              class="size-option-btn ${s.size === selectedSize ? 'active' : ''} ${s.stock === 0 ? 'disabled' : ''}" 
              data-size="${s.size}"
              ${s.stock === 0 ? 'title="Agotado temporalmente"' : ''}
            >
              ${s.size}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Selector de Material / Acabado -->
      ${product.materials && product.materials.length > 1 ? `
        <div class="variant-block">
          <div class="variant-label-row">
            <span>Material / Fibras: <strong>${selectedMaterial}</strong></span>
          </div>
          <div class="material-options" id="pdp-material-selector">
            ${product.materials.map(mat => `
              <button 
                class="material-chip ${mat === selectedMaterial ? 'active' : ''}" 
                data-material="${mat}"
              >
                ${mat}
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Selector de Cantidad y Botones de Compra -->
      <div class="pdp-actions-row">
        <div class="quantity-stepper">
          <button class="qty-btn" id="pdp-qty-minus" aria-label="Reducir cantidad">-</button>
          <input type="text" class="qty-input" id="pdp-qty-input" value="${quantity}" readonly />
          <button class="qty-btn" id="pdp-qty-plus" aria-label="Aumentar cantidad">+</button>
        </div>

        <button 
          class="btn btn-primary pdp-add-btn" 
          id="pdp-add-to-cart-btn" 
          ${isOutOfStock ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}
        >
          <i data-lucide="shopping-bag"></i> 
          ${isOutOfStock ? 'Agotado' : 'Añadir al Carrito'}
        </button>

        <button class="btn btn-icon" id="pdp-wishlist-btn" title="Guardar en Favoritos" style="width: 52px; height: 52px; border-radius: var(--radius-md);">
          <i data-lucide="heart" ${store.isInWishlist(product.id) ? 'style="color: #ef4444; fill: #ef4444;"' : ''}></i>
        </button>
      </div>

      <!-- Botón de Compra Directa Rápida (One-Step Checkout) -->
      ${!isOutOfStock ? `
        <button class="btn btn-accent btn-block btn-lg" id="pdp-buy-now-btn" style="font-weight: 700;">
          <i data-lucide="zap"></i> Comprar Ahora en 1 Clic
        </button>
      ` : `
        <button class="btn btn-outline btn-block" id="pdp-notify-stock-btn">
          <i data-lucide="bell"></i> Avisarme cuando haya stock
        </button>
      `}

      <!-- Calculadora de Envíos por Código Postal Integrada -->
      <div id="pdp-shipping-calculator-slot" style="margin-top: 0.5rem;">
        ${ShippingCalculator.renderWidget(product.price)}
      </div>

      <!-- Sellos de Seguridad y Garantía -->
      <div class="pdp-trust-seals">
        <div class="seal-item">
          <i data-lucide="truck"></i>
          <div class="seal-text">
            <strong>Envío Express Asegurado</strong>
            <span>Gratis en compras superiores a $80</span>
          </div>
        </div>
        <div class="seal-item">
          <i data-lucide="rotate-ccw"></i>
          <div class="seal-text">
            <strong>Devolución Gratuita</strong>
            <span>30 días para cambios de talla sin costo</span>
          </div>
        </div>
        <div class="seal-item">
          <i data-lucide="shield-check"></i>
          <div class="seal-text">
            <strong>Pago 100% Protegido</strong>
            <span>Encriptación 256-bit SSL y PCI-DSS</span>
          </div>
        </div>
        <div class="seal-item">
          <i data-lucide="sparkles"></i>
          <div class="seal-text">
            <strong>Atelier Sostenible</strong>
            <span>Fibras certificadas GOTS y Oeko-Tex</span>
          </div>
        </div>
      </div>
    </div>
  `;
}
