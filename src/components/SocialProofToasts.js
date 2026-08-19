/**
 * Componente Notificaciones Toast de Prueba Social (Venta Activa & Visitantes en Vivo)
 */

import { RECENT_PURCHASES } from '../data/reviews.js';

export const SocialProofToasts = {
  init(container) {
    let index = 0;

    const showNextToast = () => {
      const data = RECENT_PURCHASES[index % RECENT_PURCHASES.length];
      index++;

      const toast = document.createElement('div');
      toast.className = 'social-toast';
      toast.innerHTML = `
        <img src="${data.img}" alt="${data.product}" class="social-toast-img" />
        <div class="social-toast-text">
          <span><strong>${data.name}</strong> (${data.location})</span>
          <span style="display: block; font-size: 0.75rem; color: var(--text-secondary);">Compró: ${data.product}</span>
          <span class="social-toast-time">✓ Verificado ${data.timeAgo}</span>
        </div>
      `;

      container.appendChild(toast);

      // Desaparecer después de 5 segundos
      setTimeout(() => {
        toast.style.animation = 'toastOut 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        setTimeout(() => {
          if (toast.parentElement) toast.remove();
        }, 400);
      }, 5000);
    };

    // Intervalo de aparición aleatorio cada 14 a 22 segundos
    const triggerInterval = () => {
      const delay = Math.floor(Math.random() * (22000 - 14000 + 1)) + 14000;
      setTimeout(() => {
        showNextToast();
        triggerInterval();
      }, delay);
    };

    // Primer toast tras 6 segundos de navegación
    setTimeout(() => {
      showNextToast();
      triggerInterval();
    }, 6000);
  }
};
