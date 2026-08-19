/**
 * Componente Sistema de Rastreo de Pedidos (Order Tracking)
 */

import { ShippingProvider } from '../api/shippingProvider.js';
import { store } from '../state/store.js';

export function renderOrderTrackerModal(container) {
  container.innerHTML = `
    <div class="modal-overlay active" id="order-tracker-overlay">
      <div class="modal-dialog" style="max-width: 600px;">
        <div class="modal-header">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i data-lucide="truck" style="color: var(--text-accent);"></i>
            <h3>Rastreo de Pedido en Tiempo Real</h3>
          </div>
          <button class="btn-icon" id="tracker-close-btn" aria-label="Cerrar rastreo">
            <i data-lucide="x"></i>
          </button>
        </div>

        <div class="modal-body">
          <p style="font-size: 0.9rem; margin-bottom: 1.25rem;">
            Ingresa tu número de pedido o código de seguimiento recibido por email para consultar el estado en vivo.
          </p>

          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem;">
            <input 
              type="text" 
              id="tracker-input" 
              class="form-input" 
              placeholder="Ej. AURA-ES-89420" 
              value="AURA-ES-89420" 
              style="text-transform: uppercase; font-weight: 700;"
            />
            <button class="btn btn-primary" id="tracker-search-btn" style="white-space: nowrap;">
              <i data-lucide="search"></i> Rastrear
            </button>
          </div>

          <!-- Contenedor del Resultado -->
          <div id="tracker-result-container" style="display: flex; flex-direction: column; gap: 1.25rem;"></div>
        </div>
      </div>
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();

  attachTrackerListeners(container);
  
  // Realizar búsqueda inicial automática con el código de demo
  setTimeout(() => {
    container.querySelector('#tracker-search-btn')?.click();
  }, 100);
}

function attachTrackerListeners(container) {
  const closeBtn = container.querySelector('#tracker-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => store.closeOrderTracker());
  }

  const searchBtn = container.querySelector('#tracker-search-btn');
  const input = container.querySelector('#tracker-input');
  const resultDiv = container.querySelector('#tracker-result-container');

  if (searchBtn && input && resultDiv) {
    searchBtn.addEventListener('click', async () => {
      searchBtn.disabled = true;
      searchBtn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Buscando...`;
      if (window.lucide) window.lucide.createIcons();

      const trackingData = await ShippingProvider.trackOrder(input.value);

      resultDiv.innerHTML = `
        <div style="background: var(--bg-surface-subtle); padding: 1rem 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle);">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
            <span style="font-size: 0.82rem; color: var(--text-muted);">Mensajería: <strong>${trackingData.carrier}</strong></span>
            <span class="badge badge-new" style="background: #3b82f6;">${trackingData.statusLabel}</span>
          </div>
          <p style="font-size: 0.85rem;">
            📅 Entrega Estimada: <strong>${trackingData.estimatedDelivery}</strong>
          </p>
        </div>

        <!-- Línea de Tiempo Visual -->
        <div style="display: flex; flex-direction: column; gap: 1rem; position: relative; padding-left: 1.5rem; border-left: 2px solid var(--border-strong); margin-left: 0.75rem; margin-top: 0.5rem;">
          ${trackingData.timeline.map((step, idx) => `
            <div style="position: relative;">
              <div style="position: absolute; left: -1.95rem; top: 0.2rem; width: 14px; height: 14px; border-radius: 50%; background: ${step.completed ? '#10b981' : 'var(--border-strong)'}; border: 2px solid var(--bg-surface);"></div>
              <strong style="font-size: 0.9rem; color: ${step.current ? 'var(--text-accent)' : 'var(--text-primary)'}; display: block;">
                ${step.title} ${step.current ? '📍 (Ubicación Actual)' : ''}
              </strong>
              <p style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.15rem;">${step.description}</p>
              <span style="font-size: 0.72rem; color: var(--text-muted);">${step.date}</span>
            </div>
          `).join('')}
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();
      searchBtn.disabled = false;
      searchBtn.innerHTML = `<i data-lucide="search"></i> Rastrear`;
      if (window.lucide) window.lucide.createIcons();
    });
  }
}
