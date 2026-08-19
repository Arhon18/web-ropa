/**
 * Componente Carrito Lateral Deslizable (Drawer Cart)
 */

import { formatCurrency } from '../utils/formatters.js';
import { store } from '../state/store.js';
import confetti from 'canvas-confetti';

export function renderDrawerCart(container) {
  const state = store.state;
  const metrics = store.getCartMetrics();
  const isEmpty = state.cart.length === 0;

  container.innerHTML = `
    <!-- Header del Carrito -->
    <div class="drawer-header">
      <div class="drawer-title">
        <i data-lucide="shopping-bag"></i>
        <span>Bolsa de Compras (${metrics.itemCount})</span>
      </div>
      <button class="btn-icon" id="drawer-close-btn" aria-label="Cerrar bolsa">
        <i data-lucide="x"></i>
      </button>
    </div>

    <!-- Barra de Progreso de Envío Gratis -->
    <div class="free-shipping-meter">
      <div class="shipping-progress-text">
        <i data-lucide="${metrics.isFreeShipping ? 'check-circle' : 'truck'}" style="${metrics.isFreeShipping ? 'color: #10b981;' : ''}"></i>
        <span>
          ${metrics.isFreeShipping 
            ? '¡Felicidades! Tienes <strong>ENVÍO EXPRESS GRATIS</strong> 🎉' 
            : `Añade <strong>${formatCurrency(metrics.remainingForFreeShipping)}</strong> más para envío gratis`}
        </span>
      </div>
      <div class="progress-bar-track">
        <div class="progress-bar-fill ${metrics.isFreeShipping ? 'unlocked' : ''}" style="width: ${metrics.progressPercent}%;"></div>
      </div>
    </div>

    <!-- Cuerpo: Lista de Artículos -->
    <div class="drawer-body">
      ${isEmpty ? `
        <div class="drawer-empty">
          <i data-lucide="shopping-bag" style="width: 56px; height: 56px; color: var(--text-muted); stroke-width: 1.5;"></i>
          <h3>Tu bolsa está vacía</h3>
          <p>Explora nuestras piezas artesanales y encuentra tu prenda ideal.</p>
          <button class="btn btn-primary" id="drawer-empty-explore-btn">
            Explorar Catálogo
          </button>
        </div>
      ` : `
        ${state.cart.map(item => `
          <div class="cart-item-row" data-item-key="${item.itemKey}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
            <div class="cart-item-info">
              <h4 class="cart-item-title">${item.name}</h4>
              <span class="cart-item-variant">${item.color.name} | Talla ${item.size} | ${item.material || 'Estándar'}</span>
              <span class="cart-item-price">${formatCurrency(item.price * item.quantity)}</span>
              
              <div class="cart-item-actions">
                <div class="quantity-stepper" style="padding: 0.15rem;">
                  <button class="qty-btn" data-action="cart-minus" data-key="${item.itemKey}">-</button>
                  <span style="font-weight: 700; font-size: 0.85rem; padding: 0 0.5rem;">${item.quantity}</span>
                  <button class="qty-btn" data-action="cart-plus" data-key="${item.itemKey}">+</button>
                </div>
                <button class="cart-item-remove" data-action="cart-remove" data-key="${item.itemKey}">
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      `}
    </div>

    <!-- Footer: Resumen, Cupones y Botón de Checkout -->
    ${!isEmpty ? `
      <div class="drawer-footer">
        <!-- Cupón de Descuento -->
        <div class="promo-code-box">
          <input 
            type="text" 
            placeholder="Código de Descuento (Ej. BIENVENIDA10)" 
            class="promo-input" 
            id="drawer-coupon-input"
            value="${state.appliedCoupon ? state.appliedCoupon.code : ''}"
            ${state.appliedCoupon ? 'readonly style="background: var(--bg-surface-subtle);"' : ''}
          />
          ${state.appliedCoupon ? `
            <button class="btn btn-outline" id="drawer-remove-coupon-btn" style="padding: 0.5rem 0.8rem; font-size: 0.8rem; color: #ef4444;">
              Quitar
            </button>
          ` : `
            <button class="btn btn-outline" id="drawer-apply-coupon-btn" style="padding: 0.5rem 1rem; font-size: 0.82rem;">
              Aplicar
            </button>
          `}
        </div>

        <div id="drawer-coupon-feedback" style="font-size: 0.78rem; display: none;"></div>

        <!-- Desglose de Precios -->
        <div style="display: flex; flex-direction: column; gap: 0.4rem;">
          <div class="drawer-summary-row">
            <span>Subtotal</span>
            <span>${formatCurrency(metrics.rawSubtotal)}</span>
          </div>

          ${metrics.discount > 0 ? `
            <div class="drawer-summary-row" style="color: #10b981;">
              <span>Descuento (${state.appliedCoupon.code})</span>
              <span>-${formatCurrency(metrics.discount)}</span>
            </div>
          ` : ''}

          <div class="drawer-summary-row">
            <span>Envío Estimado</span>
            <span>${metrics.isFreeShipping ? '<strong style="color: #10b981;">GRATIS</strong>' : formatCurrency(metrics.shippingCost)}</span>
          </div>

          <div class="drawer-summary-row total">
            <span>Total Estimado</span>
            <span>${formatCurrency(metrics.total)}</span>
          </div>
        </div>

        <!-- Botón de Checkout Rápido -->
        <button class="btn btn-primary btn-block btn-lg" id="drawer-checkout-btn">
          <i data-lucide="lock"></i> Finalizar Compra Segura
        </button>

        <p style="text-align: center; font-size: 0.75rem; color: var(--text-muted);">
          🔒 Encriptación 256-bit SSL | Garantía de Devolución 30 Días
        </p>
      </div>
    ` : ''}
  `;

  if (window.lucide) window.lucide.createIcons();

  // Lanzar confeti si se desbloquea envío gratis
  if (metrics.isFreeShipping && !sessionStorage.getItem('aura_free_shipping_celebrated')) {
    sessionStorage.setItem('aura_free_shipping_celebrated', 'true');
    try {
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}
  }

  attachDrawerListeners(container);
}

function attachDrawerListeners(container) {
  const closeBtn = container.querySelector('#drawer-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => store.closeDrawer());
  }

  const exploreBtn = container.querySelector('#drawer-empty-explore-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      store.closeDrawer();
      store.setRoute('catalog');
    });
  }

  // Cart quantity controls
  container.querySelectorAll('[data-action="cart-minus"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      store.updateCartQuantity(key, -1);
    });
  });

  container.querySelectorAll('[data-action="cart-plus"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      store.updateCartQuantity(key, 1);
    });
  });

  container.querySelectorAll('[data-action="cart-remove"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-key');
      store.removeFromCart(key);
    });
  });

  // Coupons
  const applyCouponBtn = container.querySelector('#drawer-apply-coupon-btn');
  const couponInput = container.querySelector('#drawer-coupon-input');
  const feedback = container.querySelector('#drawer-coupon-feedback');

  if (applyCouponBtn && couponInput) {
    applyCouponBtn.addEventListener('click', () => {
      const res = store.applyCoupon(couponInput.value);
      if (feedback) {
        feedback.textContent = res.message;
        feedback.style.color = res.success ? '#10b981' : '#ef4444';
        feedback.style.display = 'block';
      }
    });
  }

  const removeCouponBtn = container.querySelector('#drawer-remove-coupon-btn');
  if (removeCouponBtn) {
    removeCouponBtn.addEventListener('click', () => {
      store.removeCoupon();
    });
  }

  // Checkout trigger
  const checkoutBtn = container.querySelector('#drawer-checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      store.openCheckout();
    });
  }
}
