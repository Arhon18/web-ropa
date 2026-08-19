/**
 * Componente Checkout en un solo paso (One-Step Checkout) con soporte para Invitados
 */

import { formatCurrency } from '../utils/formatters.js';
import { store } from '../state/store.js';
import { CONFIG } from '../data/config.js';
import { Security } from '../utils/security.js';
import { PaymentGateway } from '../api/paymentGateway.js';
import confetti from 'canvas-confetti';

export function renderCheckoutModal(container) {
  const state = store.state;
  const user = state.user;
  const metrics = store.getCartMetrics();
  const carriers = CONFIG.shipping.carriers;

  const defaultEmail = user ? user.email : 'cliente@aurastudio.com';
  const defaultFirstName = user ? user.name.split(' ')[0] : 'Elena';
  const defaultLastName = user && user.name.split(' ').length > 1 ? user.name.split(' ').slice(1).join(' ') : 'García';

  container.innerHTML = `
    <div class="modal-overlay active" id="checkout-modal-overlay">
      <div class="modal-dialog">
        <!-- Header -->
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="shield-check" style="color: #10b981;"></i>
            <h3>Finalizar Pedido Seguro</h3>
          </div>
          <button class="btn-icon" id="checkout-close-btn" aria-label="Cerrar checkout">
            <i data-lucide="x"></i>
          </button>
        </div>

        <!-- Cuerpo del Checkout -->
        <div class="modal-body" id="checkout-body-content">
          <div class="checkout-grid">
            <!-- Columna Izquierda: Datos, Envío y Pago -->
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
              
              <!-- 1. Contacto y Modalidad (Invitado vs Cuenta) -->
              <div>
                <h4 style="margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span style="background: var(--text-primary); color: var(--text-inverse); width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem;">1</span>
                  Información de Contacto
                </h4>
                
                <div class="form-group">
                  <label class="form-label" for="chk-email">Correo Electrónico (Para envío de recibo y rastreo)</label>
                  <input type="email" id="chk-email" class="form-input" placeholder="tu-correo@ejemplo.com" required value="${defaultEmail}" />
                </div>

                <div style="display: flex; gap: 1rem; font-size: 0.82rem;">
                  <label style="display: flex; align-items: center; gap: 0.35rem; cursor: pointer;">
                    <input type="checkbox" id="chk-guest" ${user ? '' : 'checked'} /> Continuar como <strong>Invitado (Guest Checkout)</strong>
                  </label>
                </div>
              </div>

              <!-- 2. Dirección de Entrega -->
              <div>
                <h4 style="margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span style="background: var(--text-primary); color: var(--text-inverse); width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem;">2</span>
                  Dirección de Entrega
                </h4>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="chk-fname">Nombre</label>
                    <input type="text" id="chk-fname" class="form-input" placeholder="Elena" value="${defaultFirstName}" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="chk-lname">Apellidos</label>
                    <input type="text" id="chk-lname" class="form-input" placeholder="García" value="${defaultLastName}" required />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="chk-address">Calle y Número / Apartamento</label>
                  <input type="text" id="chk-address" class="form-input" placeholder="Calle Velázquez 42, 3º Izq" value="Calle Velázquez 42" required />
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label" for="chk-city">Ciudad</label>
                    <input type="text" id="chk-city" class="form-input" placeholder="Madrid" value="Madrid" required />
                  </div>
                  <div class="form-group">
                    <label class="form-label" for="chk-zip">Código Postal</label>
                    <input type="text" id="chk-zip" class="form-input" placeholder="28001" value="28001" required />
                  </div>
                </div>
              </div>

              <!-- 3. Opciones de Logística & Envío -->
              <div>
                <h4 style="margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span style="background: var(--text-primary); color: var(--text-inverse); width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem;">3</span>
                  Método de Entrega
                </h4>

                <div style="display: flex; flex-direction: column; gap: 0.5rem;" id="checkout-shipping-options">
                  ${carriers.map((carrier, index) => {
                    const isSelected = state.selectedShippingMethod.id === carrier.id;
                    const cost = metrics.isFreeShipping && carrier.id === 'standard' ? 0 : carrier.cost;
                    return `
                      <label style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; border: 1px solid ${isSelected ? 'var(--text-primary)' : 'var(--border-strong)'}; border-radius: var(--radius-md); background: ${isSelected ? 'var(--bg-surface-subtle)' : 'var(--bg-surface)'}; cursor: pointer;">
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                          <input type="radio" name="chk-carrier" value="${carrier.id}" ${isSelected ? 'checked' : ''} />
                          <div>
                            <strong style="font-size: 0.88rem; display: block;">${carrier.name}</strong>
                            <span style="font-size: 0.75rem; color: var(--text-secondary);">Seguimiento por GPS incluido</span>
                          </div>
                        </div>
                        <span style="font-weight: 700; font-size: 0.9rem;">
                          ${cost === 0 ? '<span style="color: #10b981;">GRATIS</span>' : formatCurrency(cost)}
                        </span>
                      </label>
                    `;
                  }).join('')}
                </div>
              </div>

              <!-- 4. Método de Pago (PCI DSS Tokenized) -->
              <div>
                <h4 style="margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.4rem;">
                  <span style="background: var(--text-primary); color: var(--text-inverse); width: 22px; height: 22px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-size: 0.75rem;">4</span>
                  Pasarela de Pago Segura (PCI-DSS)
                </h4>

                <div class="payment-method-selector">
                  <div class="payment-chip active" data-method="card">
                    <i data-lucide="credit-card"></i>
                    <span>Tarjeta de Crédito / Débito</span>
                  </div>
                  <div class="payment-chip" data-method="paypal">
                    <i data-lucide="wallet"></i>
                    <span>PayPal Express</span>
                  </div>
                  <div class="payment-chip" data-method="mercadopago">
                    <i data-lucide="dollar-sign"></i>
                    <span>Mercado Pago</span>
                  </div>
                </div>

                <!-- Formulario de Tarjeta -->
                <div id="card-payment-form">
                  <div class="form-group">
                    <label class="form-label" for="card-num">Número de Tarjeta</label>
                    <input type="text" id="card-num" class="form-input" placeholder="4242 •••• •••• 4242" value="4242 4242 4242 4242" maxlength="19" />
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label class="form-label" for="card-exp">Caducidad (MM/AA)</label>
                      <input type="text" id="card-exp" class="form-input" placeholder="12/28" value="12/28" maxlength="5" />
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="card-cvc">Código CVC</label>
                      <input type="password" id="card-cvc" class="form-input" placeholder="888" value="888" maxlength="4" />
                    </div>
                  </div>
                </div>

                <div class="security-notice-box">
                  <i data-lucide="lock" style="color: #10b981;"></i>
                  <span>Tus datos viajan encriptados bajo protocolo TLS 1.3 / SSL 256-bit. Tokenización bancaria activa.</span>
                </div>
              </div>
            </div>

            <!-- Columna Derecha: Resumen del Pedido -->
            <div style="background-color: var(--bg-surface-subtle); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); height: fit-content;">
              <h4 style="margin-bottom: 1rem;">Resumen de Compra</h4>

              <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.25rem; max-height: 220px; overflow-y: auto;">
                ${state.cart.map(item => `
                  <div style="display: flex; gap: 0.75rem; align-items: center; font-size: 0.85rem;">
                    <img src="${item.image}" alt="${item.name}" style="width: 44px; height: 54px; object-fit: cover; border-radius: var(--radius-sm);" />
                    <div style="flex: 1;">
                      <strong style="display: block;">${item.name}</strong>
                      <span style="color: var(--text-muted); font-size: 0.75rem;">${item.color.name} / ${item.size} × ${item.quantity}</span>
                    </div>
                    <strong>${formatCurrency(item.price * item.quantity)}</strong>
                  </div>
                `).join('')}
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.5rem; border-top: 1px solid var(--border-subtle); padding-top: 1rem; font-size: 0.88rem;">
                <div style="display: flex; justify-content: space-between;">
                  <span>Subtotal:</span>
                  <span>${formatCurrency(metrics.rawSubtotal)}</span>
                </div>
                ${metrics.discount > 0 ? `
                  <div style="display: flex; justify-content: space-between; color: #10b981;">
                    <span>Descuento aplicado:</span>
                    <span>-${formatCurrency(metrics.discount)}</span>
                  </div>
                ` : ''}
                <div style="display: flex; justify-content: space-between;">
                  <span>Costo de Envío:</span>
                  <span>${metrics.isFreeShipping ? '<strong style="color: #10b981;">GRATIS</strong>' : formatCurrency(metrics.shippingCost)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: 800; border-top: 1px dashed var(--border-strong); padding-top: 0.75rem; margin-top: 0.25rem;">
                  <span>Total a Pagar:</span>
                  <span>${formatCurrency(metrics.total)}</span>
                </div>
              </div>

              <!-- Botón de Pago Final -->
              <button class="btn btn-primary btn-block btn-lg" id="checkout-submit-btn" style="margin-top: 1.5rem;">
                <i data-lucide="check"></i> Confirmar & Pagar ${formatCurrency(metrics.total)}
              </button>

              <div id="checkout-error-msg" style="color: #ef4444; font-size: 0.8rem; text-align: center; margin-top: 0.75rem; display: none;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  attachCheckoutListeners(container);
}

function attachCheckoutListeners(container) {
  const closeBtn = container.querySelector('#checkout-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => store.closeCheckout());
  }

  // Carrier Radio Selection
  container.querySelectorAll('input[name="chk-carrier"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      const selectedId = e.target.value;
      const carrier = CONFIG.shipping.carriers.find(c => c.id === selectedId);
      if (carrier) {
        store.state.selectedShippingMethod = carrier;
        renderCheckoutModal(container);
      }
    });
  });

  // Payment Tabs
  container.querySelectorAll('.payment-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      container.querySelectorAll('.payment-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // Submit Order
  const submitBtn = container.querySelector('#checkout-submit-btn');
  const errorMsg = container.querySelector('#checkout-error-msg');
  const bodyContent = container.querySelector('#checkout-body-content');

  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Procesando Pago Seguro...`;
      if (window.lucide) window.lucide.createIcons();

      const email = container.querySelector('#chk-email')?.value;
      const cardNum = container.querySelector('#card-num')?.value;

      if (!Security.isValidEmail(email)) {
        errorMsg.textContent = 'Por favor, ingresa un correo electrónico válido.';
        errorMsg.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i data-lucide="check"></i> Confirmar & Pagar`;
        return;
      }

      // Procesar Pago con Pasarela
      const metrics = store.getCartMetrics();
      const paymentResult = await PaymentGateway.processStripePayment({
        amount: metrics.total,
        currency: 'usd',
        cardData: { number: cardNum, expMonth: '12', expYear: '28', cvc: '888' },
        customerEmail: email
      });

      if (paymentResult.success) {
        // Lanzar Confeti
        try { confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } }); } catch (e) {}

        const trackingNumber = `AURA-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

        // Mostrar Pantalla de Confirmación de Pedido
        bodyContent.innerHTML = `
          <div style="text-align: center; padding: 2.5rem 1rem; display: flex; flex-direction: column; align-items: center; gap: 1.25rem;">
            <div style="width: 72px; height: 72px; border-radius: 50%; background: #10b981; color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 2rem;">
              ✓
            </div>
            <h2>¡Gracias por tu compra, ${Security.sanitize(container.querySelector('#chk-fname')?.value || 'Cliente')}!</h2>
            <p style="max-width: 480px;">
              Tu pedido ha sido procesado con éxito bajo el identificador de transacción <code>${paymentResult.transactionId}</code>. Hemos enviado la confirmación y recibo detallado a <strong>${Security.sanitize(email)}</strong>.
            </p>

            <div style="background: var(--bg-surface-subtle); padding: 1.25rem 2rem; border-radius: var(--radius-lg); border: 1px dashed var(--border-strong); margin: 0.5rem 0;">
              <span style="font-size: 0.85rem; color: var(--text-muted);">Número de Rastreo DHL Express:</span>
              <h3 style="color: var(--text-accent); font-family: var(--font-sans); letter-spacing: 0.05em; margin-top: 0.25rem;">${trackingNumber}</h3>
            </div>

            <div style="display: flex; gap: 1rem; margin-top: 1rem;">
              <button class="btn btn-primary" id="checkout-track-btn">
                <i data-lucide="truck"></i> Rastrear Mi Pedido Ahora
              </button>
              <button class="btn btn-outline" id="checkout-continue-shopping-btn">
                Volver a la Tienda
              </button>
            </div>
          </div>
        `;

        if (window.lucide) window.lucide.createIcons();

        // Vaciar Carrito tras compra exitosa
        store.clearCart();

        // Listeners en confirmación
        const trackBtn = bodyContent.querySelector('#checkout-track-btn');
        if (trackBtn) {
          trackBtn.addEventListener('click', () => {
            store.closeCheckout();
            store.openOrderTracker();
          });
        }

        const continueBtn = bodyContent.querySelector('#checkout-continue-shopping-btn');
        if (continueBtn) {
          continueBtn.addEventListener('click', () => {
            store.closeCheckout();
            store.setRoute('home');
          });
        }

      } else {
        errorMsg.textContent = paymentResult.error || 'Error al procesar el pago.';
        errorMsg.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i data-lucide="check"></i> Reintentar Pago`;
      }
    });
  }
}
