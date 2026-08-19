/**
 * Componente Popup de Intención de Salida (Exit-Intent Modal)
 */

import { Storage } from '../state/storage.js';
import { store } from '../state/store.js';

export const ExitIntentPopup = {
  init(container) {
    if (Storage.isExitPopupDismissed()) return;

    let triggered = false;

    const showModal = () => {
      if (triggered || Storage.isExitPopupDismissed()) return;
      triggered = true;

      container.innerHTML = `
        <div class="exit-intent-modal">
          <button class="btn-icon" id="exit-intent-close-btn" style="position: absolute; top: 1rem; right: 1rem;" aria-label="Cerrar oferta">
            <i data-lucide="x"></i>
          </button>

          <span class="badge badge-sale" style="margin-bottom: 0.75rem;">Oferta Exclusiva de Despedida</span>
          <h2 style="font-size: 1.85rem; line-height: 1.2;">¡No te vayas con las manos vacías!</h2>
          <p style="margin-top: 0.5rem; font-size: 0.95rem;">
            Disfruta de un <strong>10% de descuento adicional</strong> en toda la colección Atelier utilizando el siguiente código:
          </p>

          <div class="coupon-code-badge" id="exit-intent-copy-coupon" title="Haz clic para copiar">
            <span>BIENVENIDA10</span>
            <i data-lucide="copy" style="width: 18px; height: 18px;"></i>
          </div>

          <p id="exit-coupon-copied-msg" style="font-size: 0.8rem; color: #10b981; margin-bottom: 1rem; display: none;">
            ✓ ¡Código copiado al portapapeles y aplicado a tu bolsa!
          </p>

          <button class="btn btn-primary btn-block btn-lg" id="exit-intent-apply-btn">
            Aplicar Descuento & Continuar Comprando
          </button>
        </div>
      `;

      container.classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons();

      // Listeners
      const closeBtn = container.querySelector('#exit-intent-close-btn');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          container.classList.add('hidden');
          Storage.dismissExitPopup();
        });
      }

      const copyBadge = container.querySelector('#exit-intent-copy-coupon');
      const applyBtn = container.querySelector('#exit-intent-apply-btn');
      const copiedMsg = container.querySelector('#exit-coupon-copied-msg');

      const applyAndCopy = () => {
        navigator.clipboard.writeText('BIENVENIDA10');
        store.applyCoupon('BIENVENIDA10');
        if (copiedMsg) copiedMsg.style.display = 'block';
        setTimeout(() => {
          container.classList.add('hidden');
          Storage.dismissExitPopup();
        }, 1200);
      };

      if (copyBadge) copyBadge.addEventListener('click', applyAndCopy);
      if (applyBtn) applyBtn.addEventListener('click', applyAndCopy);
    };

    // Detectar salida del cursor hacia la barra de pestañas
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 15) {
        showModal();
      }
    });
  }
};
