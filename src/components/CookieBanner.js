/**
 * Componente Banner de Consentimiento de Cookies (GDPR & CCPA Compliant)
 */

import { Storage } from '../state/storage.js';

export const CookieBanner = {
  init(container) {
    if (Storage.getConsent()) return;

    container.innerHTML = `
      <div class="cookie-content">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
          <i data-lucide="shield" style="color: var(--text-accent); width: 20px; height: 20px;"></i>
          <strong style="font-size: 0.95rem;">Tu Privacidad y Cookies</strong>
        </div>
        <p style="font-size: 0.82rem; line-height: 1.45;">
          Utilizamos cookies esenciales para el funcionamiento de la tienda y cookies analíticas para mejorar tu experiencia de compra y personalizar recomendaciones.
        </p>
        <div class="cookie-actions">
          <button class="btn btn-primary" id="cookie-accept-all-btn" style="flex: 1; padding: 0.55rem 0.85rem; font-size: 0.8rem;">
            Aceptar Todas
          </button>
          <button class="btn btn-outline" id="cookie-reject-btn" style="padding: 0.55rem 0.85rem; font-size: 0.8rem;">
            Solo Esenciales
          </button>
        </div>
      </div>
    `;

    container.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();

    const acceptBtn = container.querySelector('#cookie-accept-all-btn');
    const rejectBtn = container.querySelector('#cookie-reject-btn');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        Storage.saveConsent({ analytics: true, marketing: true, timestamp: Date.now() });
        container.classList.add('hidden');
      });
    }

    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => {
        Storage.saveConsent({ analytics: false, marketing: false, timestamp: Date.now() });
        container.classList.add('hidden');
      });
    }
  }
};
