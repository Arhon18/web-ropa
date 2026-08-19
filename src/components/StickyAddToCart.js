/**
 * Barra Flotante Inferior "Sticky Add to Cart" para Mobile & Desktop Scroll
 */

import { formatCurrency } from '../utils/formatters.js';
import { store } from '../state/store.js';

export function renderStickyBar(container, product, activeColor, activeSize, activeMaterial) {
  const isOutOfStock = product.sizes.find(s => s.size === activeSize)?.stock === 0;

  container.innerHTML = `
    <div class="sticky-pdp-content">
      <div class="sticky-product-meta">
        <img 
          src="${activeColor.images[0]}" 
          alt="${product.name}" 
          class="sticky-product-thumb" 
        />
        <div>
          <h4 class="sticky-product-title">${product.name}</h4>
          <span class="sticky-product-price">${formatCurrency(product.price)}</span>
        </div>
      </div>

      <div class="sticky-actions">
        <span style="font-size: 0.82rem; font-weight: 700; background: var(--bg-surface-subtle); padding: 0.3rem 0.6rem; border-radius: var(--radius-sm);">
          ${activeColor.name} / ${activeSize}
        </span>

        <button 
          class="btn btn-primary" 
          id="sticky-buy-btn"
          ${isOutOfStock ? 'disabled style="opacity: 0.5;"' : ''}
        >
          <i data-lucide="shopping-bag"></i> ${isOutOfStock ? 'Agotado' : 'Añadir'}
        </button>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  const buyBtn = container.querySelector('#sticky-buy-btn');
  if (buyBtn && !isOutOfStock) {
    buyBtn.addEventListener('click', () => {
      store.addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        color: activeColor,
        size: activeSize,
        material: activeMaterial,
        image: activeColor.images[0],
        quantity: 1
      });
    });
  }
}

export function initStickyScrollObserver(triggerElement, stickyContainer) {
  if (!triggerElement || !stickyContainer) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        stickyContainer.classList.remove('hidden');
      } else {
        stickyContainer.classList.add('hidden');
      }
    });
  }, { threshold: 0.1 });

  observer.observe(triggerElement);
}
