/**
 * Componente Tarjeta de Producto (Catálogo)
 */

import { formatCurrency, formatDiscount } from '../utils/formatters.js';
import { store } from '../state/store.js';

export function renderProductCard(product) {
  const isWishlisted = store.isInWishlist(product.id);
  const discountPercent = formatDiscount(product.originalPrice, product.price);
  const defaultColor = product.colors[0];
  const mainImage = defaultColor.images[0];
  const hoverImage = defaultColor.images[1] || mainImage;
  
  // Stock total calculation
  const totalStock = product.sizes.reduce((acc, s) => acc + s.stock, 0);
  const isLowStock = totalStock > 0 && totalStock <= 4;
  const isOutOfStock = totalStock === 0;

  return `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-card-image-wrap" data-action="view-pdp" data-product-id="${product.id}">
        <img 
          src="${mainImage}" 
          alt="${product.name}"
          loading="lazy"
          class="card-img-primary"
        />

        <!-- Badges de Estado -->
        <div class="product-card-badges">
          ${product.badge ? `<span class="badge ${product.badgeType === 'sale' ? 'badge-sale' : 'badge-new'}">${product.badge}</span>` : ''}
          ${discountPercent > 0 ? `<span class="badge badge-sale">-${discountPercent}%</span>` : ''}
          ${isLowStock ? `<span class="badge badge-low-stock"><span class="stock-dot low"></span> ¡Pocas Unidades!</span>` : ''}
          ${isOutOfStock ? `<span class="badge badge-out-stock">Agotado</span>` : ''}
        </div>

        <!-- Botón de Lista de Deseos -->
        <button class="btn-icon product-card-wishlist ${isWishlisted ? 'active' : ''}" data-action="toggle-wishlist" data-product-id="${product.id}" title="${isWishlisted ? 'Quitar de Favoritos' : 'Añadir a Favoritos'}">
          <i data-lucide="heart" ${isWishlisted ? 'style="color: #ef4444; fill: #ef4444;"' : ''}></i>
        </button>
      </div>

      <div class="product-card-content">
        <span class="product-card-category">${product.category}</span>
        
        <h3 class="product-card-title" data-action="view-pdp" data-product-id="${product.id}">
          ${product.name}
        </h3>

        <!-- Puntuación por Estrellas -->
        <div class="product-card-rating">
          <div class="stars">
            ${'★'.repeat(Math.round(product.rating))}${'☆'.repeat(5 - Math.round(product.rating))}
          </div>
          <span>(${product.reviewCount})</span>
        </div>

        <!-- Muestrarios de Color -->
        <div class="product-card-swatches">
          ${product.colors.map((c, idx) => `
            <span 
              class="swatch-circle ${idx === 0 ? 'active' : ''}" 
              style="background-color: ${c.hex};" 
              title="${c.name}"
            ></span>
          `).join('')}
        </div>

        <!-- Fila de Precio y Acción Rápida -->
        <div class="product-card-price-row">
          <div>
            <span class="price-current">${formatCurrency(product.price)}</span>
            ${product.originalPrice ? `<span class="price-original">${formatCurrency(product.originalPrice)}</span>` : ''}
          </div>
          
          <button 
            class="btn btn-outline" 
            style="padding: 0.4rem 0.9rem; font-size: 0.82rem;" 
            data-action="quick-view" 
            data-product-id="${product.id}"
          >
            Ver Detalles
          </button>
        </div>
      </div>
    </article>
  `;
}

export function attachProductCardListeners(container) {
  container.querySelectorAll('[data-action="view-pdp"], [data-action="quick-view"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const productId = el.getAttribute('data-product-id');
      store.setRoute('pdp', productId);
    });
  });

  container.querySelectorAll('[data-action="toggle-wishlist"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const productId = btn.getAttribute('data-product-id');
      store.toggleWishlist(productId);
      const icon = btn.querySelector('i');
      if (store.isInWishlist(productId)) {
        btn.classList.add('active');
        if (icon) {
          icon.style.color = '#ef4444';
          icon.style.fill = '#ef4444';
        }
      } else {
        btn.classList.remove('active');
        if (icon) {
          icon.style.color = '';
          icon.style.fill = '';
        }
      }
    });
  });
}
